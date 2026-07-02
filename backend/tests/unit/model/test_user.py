# import pytest
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker

# from app.core.database import Base
# from app.model.client import Client
# from app.model.user import User

# # ---------- Test DB setup ----------


# @pytest.fixture
# def db():
#     engine = create_engine("sqlite:///:memory:", echo=False)
#     TestingSessionLocal = sessionmaker(bind=engine)

#     Base.metadata.create_all(bind=engine)

#     session = TestingSessionLocal()
#     yield session

#     session.close()


# # ---------- Tests ----------


# def test_create_client(db):
#     client = Client(name="Juan", surname="Perez", email="juan@test.com", password="1234")

#     db.add(client)
#     db.commit()
#     db.refresh(client)

#     assert client.id is not None
#     assert client.name == "Juan"
#     assert client.surname == "Perez"


# def test_polymorphic_query(db):
#     client = Client(name="Ana", surname="Gomez", email="ana@test.com", password="abcd")

#     db.add(client)
#     db.commit()

#     user = db.query(User).first()

#     # 🔥 Esto es lo importante
#     assert isinstance(user, Client)
#     assert user.email == "ana@test.com"
