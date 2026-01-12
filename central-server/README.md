1. Install dependencies:


	pip install -r requirements.txt


1. Run the server:


	uvicorn main:app --reload


1. Test the endpoint:


	curl -X POST http://localhost:8000/api/verify \
	  -H "Content-Type: application/json" \
	  -d '{"publicKey":"pk_alice_123","callbackUrl":"https://webhook.site/your-id"}'