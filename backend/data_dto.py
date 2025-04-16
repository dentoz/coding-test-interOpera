from pydantic import BaseModel
from typing import List

class DealDTO(BaseModel):
    client: str
    value: int
    status: str

class ClientDTO(BaseModel):
    name: str
    industry: str
    contact: str

class SalesRepDTO(BaseModel):
    name: str
    role: str
    region: str
    skills: List[str]
    deals: List[DealDTO]
    clients: List[ClientDTO]