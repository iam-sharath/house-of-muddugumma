"""Basic smoke tests. Add real tests here as you build features —
FastAPI's TestClient makes this easy without needing a live server.
"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_root_health_check():
    response = client.get("/api/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_public_products_endpoint_is_reachable():
    response = client.get("/api/products")
    assert response.status_code == 200
    body = response.json()
    assert "items" in body
    assert "total" in body
