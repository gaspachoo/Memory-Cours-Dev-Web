from typing import Annotated
from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi.middleware.cors import CORSMiddleware


class Score(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    joueur: str = Field(index=True)
    score: int | None = Field(default=None)
    time: int | None = Field(default=None)
    created_at: datetime = Field(default_factory=datetime.now)


class ScoreCreate(SQLModel):
    joueur: str
    score: int | None = Field(default=None)
    time: int | None = Field(default=None)


class ScoreRead(SQLModel):
    id: int
    joueur: str
    score: int | None
    time: int | None
    created_at: datetime


sqlite_file_name = "database.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI()


origins = [
    "http://localhost:8000",
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.post("/scores/", response_model=ScoreRead)
def create_score(score_data: ScoreCreate, session: SessionDep) -> Score:
    db_score = Score.model_validate(score_data)
    session.add(db_score)
    session.commit()
    session.refresh(db_score)
    return db_score


@app.get("/scores/", response_model=list[ScoreRead])
def read_scores(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Score]:
    scores = session.exec(select(Score).offset(offset).limit(limit)).all()
    return scores


@app.get("/scores/{score_id}", response_model=ScoreRead)
def read_score(score_id: int, session: SessionDep) -> Score:
    score = session.get(Score, score_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    return score


@app.delete("/scores/{score_id}")
def delete_score(score_id: int, session: SessionDep):
    score = session.get(Score, score_id)
    if not score:
        raise HTTPException(status_code=404, detail="Score not found")
    session.delete(score)
    session.commit()
    return {"ok": True}
