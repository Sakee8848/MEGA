import json
import requests
import time
import os

BASE_URL = "http://localhost:8000"

def seed():
    print("Waiting for server to start...")
    # Simple wait loop
    for i in range(10):
        try:
            r = requests.get(BASE_URL)
            if r.status_code == 200:
                print("Server is up!")
                break
        except:
            time.sleep(2)
    else:
        print("Server failed to respond.")
        return

    with open("seed_data.json", "r") as f:
        data = json.load(f)

    for email in data:
        print(f"Ingesting: {email['subject']}")
        payload = {
            "subject": email['subject'],
            "sender": email['sender'],
            "body": email['body'],
            "received_at": email['received_at']
        }
        try:
            res = requests.post(f"{BASE_URL}/ingest", json=payload)
            if res.status_code == 200:
                resp_data = res.json()
                print(f" -> Success: {resp_data.get('id', 'ID NOT FOUND')}")
                if 'id' not in resp_data:
                    print(f"    Full Response: {resp_data}")
            else:
                print(f" -> Failed: {res.status_code} - {res.text}")
        except Exception as e:
            print(f" -> Error: {e}")

if __name__ == "__main__":
    seed()
