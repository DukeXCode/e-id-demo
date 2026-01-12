import sqlite3
from datetime import datetime
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

DATABASE = "database.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Run migration on startup
    conn = get_db()
    with open("migration.sql", "r") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    yield


app = FastAPI(lifespan=lifespan)


class VerifyRequest(BaseModel):
    publicKey: str
    callbackUrl: str


@app.post("/api/verify")
async def verify(request: VerifyRequest):
    conn = get_db()
    cursor = conn.cursor()

    # Log verification request
    cursor.execute(
        "INSERT INTO verification_requests (createdAt, callbackUrl, publicKey) VALUES (?, ?, ?)",
        (datetime.utcnow().isoformat(), request.callbackUrl, request.publicKey),
    )
    conn.commit()

    # Get digital identity
    cursor.execute(
        "SELECT * FROM digital_identity WHERE publicKey = ?", (request.publicKey,)
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        raise HTTPException(status_code=404, detail="Identity not found")

    identity_data = {
        "id": row["id"],
        "publicKey": row["publicKey"],
        "firstName": row["firstName"],
        "lastName": row["lastName"],
        "dateOfBirth": row["dateOfBirth"],
        "address": row["address"],
        "placeOfOrigin": row["placeOfOrigin"],
        "expiryDate": row["expiryDate"],
    }

    # Send POST request to callback URL
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(request.callbackUrl, json=identity_data)
            response.raise_for_status()
        except httpx.RequestError as e:
            raise HTTPException(status_code=502, detail=f"Callback failed: {str(e)}")

    return {"status": "success", "message": "Identity sent to callback URL"}
