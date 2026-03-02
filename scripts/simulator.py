import requests
import time
import uuid
import json

# --- ⚙️ CONFIGURATION ---
# Replace with your actual local Hono URL and API Key from the 'api_keys' table
API_URL = "http://localhost:3000/api/ingest"
API_KEY = "sk_agent_123456" 
HEADERS = {"Content-Type": "application/json", "x-api-key": API_KEY}

def execute_command(agent_id, command):
    """
    STRICTLY INTERNAL: Executes the 'Self-Healing' instruction received
    from the Hono Control Plane.
    """
    action = command.get("action")
    print(f"\n[⚡ ACTION] RECEIVED REMOTE COMMAND: {action}")
    
    if action == "RESTART_TUNNEL":
        print(f"🔄 [{agent_id}] Initializing Tunnel Reset Sequence...")
        # Simulation of a system-level repair
        time.sleep(1.5)
        print(f"✅ [{agent_id}] Tunnel Successfully Restarted. Connectivity Restored.")
    
    elif action == "RESET_STATE":
        print(f"🧹 [{agent_id}] Clearing local agent cache and resetting state...")
        time.sleep(1)
        print(f"✅ [{agent_id}] State reset complete.")

def send_telemetry(agent_id, method, status, metadata=None):
    """
    Sends JSON-RPC 2.0 telemetry and checks for 'Command Piggybacking' in the response.
    """
    payload = {
        "jsonrpc": "2.0",
        "method": method,
        "params": {
            "agentId": agent_id,
            "status": status,
            "metadata": metadata or {}
        }
    }
    
    try:
        # We use a 5-second timeout to prevent the agent from hanging if the server is down
        response = requests.post(API_URL, headers=HEADERS, json=payload, timeout=5)
        
        if response.status_code == 202:
            data = response.json()
            print(f"📡 [{agent_id}] {method.upper()} -> {status}")
            
            # 🚨 THE HEALING LOOP: Check if the Dashboard sent a command back
            if "command" in data:
                execute_command(agent_id, data["command"])
        else:
            print(f"❌ [{agent_id}] Server returned error {response.status_code}: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"⚠️ [{agent_id}] Network Error: {e}")

def run_standard_simulation():
    """Simulates a healthy A2A and Payment flow"""
    alice = "alpha-collector"
    bob = "beta-processor"

    print("🚀 Starting Specula Protocol Simulation...")

    # 1. Online Heartbeat
    send_telemetry(alice, "heartbeat", "online", {"role": "initiator"})
    send_telemetry(bob, "heartbeat", "online", {"role": "responder"})
    time.sleep(2)

    # 2. A2A Handshake
    print(f"\n🤝 Handshake Flow")
    send_telemetry(alice, "a2a_handshake", "requesting", {"peer": bob})
    time.sleep(1)
    send_telemetry(bob, "a2a_handshake", "accepted", {"peer": alice})
    time.sleep(2)

    # 3. Payment Settlement
    print(f"\n💰 Payment Flow")
    send_telemetry(alice, "payment_settlement", "sending_50_USDC", {"to": bob})
    time.sleep(1)
    send_telemetry(bob, "payment_settlement", "received_50_USDC", {"from": alice})

def simulate_critical_failure():
    """Explicitly triggers a failure that will pop up on the Dashboard Alert UI"""
    agent_a = "alpha-collector"
    print("\n⚠️ TRIGGERING CRITICAL FAILURE ALERT...")
    
    send_telemetry(agent_a, "payment_settlement", "failed", {
        "error": "Insufficient Gas for X402 Settlement",
        "tx_hash": "0xDEADBEEF"
    })

if __name__ == "__main__":
    try:
        # Run the 'Happy Path' first
        run_standard_simulation()
        
        # Trigger the alert that requires manual 'Healing' from the Dashboard
        simulate_critical_failure()

        # ENTER POLL LOOP: The agent is now idle but listening for your 'Heal' button click
        print("\n🛰️  Agent alpha-collector is now in IDLE mode.")
        print("💡 Click 'RESTART NETWORK TUNNEL' on your Dashboard now to see the healing loop.")
        
        while True:
            # Send a heartbeat every 5 seconds to 'poll' for pending commands in the HTTP response
            send_telemetry("alpha-collector", "heartbeat", "idle")
            time.sleep(5)

    except KeyboardInterrupt:
        print("\n🛑 Simulation stopped by user.")