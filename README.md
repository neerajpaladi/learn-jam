# Learn-Jam 🎯

> An AI-driven adaptive learning platform backend featuring real-time Item Response Theory (IRT) ability estimation, DAG-based prerequisite knowledge graph tracing, and multi-agent dynamic path orchestration.

---

## 📌 Overview

**Learn-Jam** bridges the gap between passive learning and personalized mastery. When a student struggles with a complex topic, standard learning platforms keep repeating the same content. Learn-Jam's engine dynamically recalibrates the student's estimated ability score ($	heta$), inspects a Directed Acyclic Graph (DAG) of concept dependencies to identify root-cause skill gaps, and instantly reroutes the student to targeted remediation modules matching their preferred learning style (`visual`, `textual`, or `interactive`).

---

## ✨ Key Features

* **Real-time IRT Diagnostic Engine (2PL Model):** Dynamically updates student ability score ($	heta \in [-3.0, 3.0]$) and concept-level mastery upon every quiz answer submission.
* **DAG-Based Root Cause Gap Analysis:** Recursively traverses concept dependency DAGs to catch missing prerequisite foundations (e.g., catching scope issues when failing recursion).
* **Multi-Agent Decision Orchestrator:** Dynamic state machine that shifts student focus between target learning goals and active remediation paths.
* **Format & Ability Matched Content Matching:** Ranks resources based on difficulty distance to student $	heta$ and alignment with preferred content formats.
* **Daily Activity & Streak Mechanics:** Gamified retention loop tracking active study days, current streaks, and longest streaks.
* **JWT-Based Authentication & User Profiles:** Secure registration, bcrypt password hashing, and auto-provisioned student learning profiles.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | FastAPI | High-performance asynchronous Python web framework |
| **ORM & DB** | SQLModel / SQLite | Declarative ORM mapping with JSON field support |
| **Auth & Security** | PyJWT & Passlib (Bcrypt) | Token-based auth & salted password hashing |
| **Psychometrics** | Custom 2PL IRT Engine | Online Stochastic Gradient Descent recalibration |
| **Knowledge Graph** | DAG Dependency Engine | Recursive ancestor traversal algorithm |

---

## 🧮 Algorithmic & Mathematical Architecture

### 1. Item Response Theory (2-Parameter Logistic Model)

The probability $P(\theta)$ of a student with ability $\theta$ answering a question of difficulty $b$ and discrimination $a$ correctly is given by:

$$P(\theta) = \frac{1}{1 + e^{-a(\theta - b)}}$$

Ability scores are updated online after each response using Stochastic Gradient Descent:

$$\theta_{\text{new}} = \theta_{\text{old}} + \alpha \cdot (\text{Response} - P(\theta_{\text{old}}))$$

where $\text{Response} \in \{0, 1\}$ and $\alpha = 0.25$ is the learning rate.

### 2. Multi-Agent Decision Loop

```text
                  +-----------------------+
                  |  Quiz Answer Submit   |
                  +-----------+-----------+
                              |
                              v
                  +-----------------------+
                  |  IRT Recalibration    |
                  |  Theta & Mastery Map  |
                  +-----------+-----------+
                              |
                              v
                  +-----------------------+
                  |  Prerequisite Check   |
                  |  (DAG Traversal Loop) |
                  +-----------+-----------+
                              |
              +---------------+---------------+
              |                               |
       [ Gaps Found ]                  [ No Gaps Found ]
              |                               |
              v                               v
    +-------------------+           +-------------------+
    | Remediation Path  |           |   Target Topic    |
    |  (Root Cause Topic)           |  (Requested Topic)|
    +---------+---------+           +---------+---------+
              |                               |
              +---------------+---------------+
                              |
                              v
                  +-----------------------+
                  | Resource Matching     |
                  | (Theta + Style Match) |
                  +-----------------------+
```

---

## 📁 Repository Structure

```text
Learn-Jam/
├── backend/
│   ├── src/
│   │   ├── agents/          # Multi-agent state & decision orchestrator
│   │   ├── assessment/      # IRT scoring engine & learning router
│   │   ├── auth/            # JWT authentication, deps, & password hashing
│   │   ├── db/              # SQLModel schema definitions & DB session initialization
│   │   ├── graph/           # DAG concept dependency manager & gap tracer
│   │   ├── models/          # Pydantic schemas (assessment, resource, student, auth)
│   │   ├── profile/         # Profile management & daily streak tracking
│   │   └── vector_db/       # Resource database & format-aware content retriever
│   ├── main.py              # FastAPI application entrypoint with CORS
│   └── requirements.txt     # Python dependency manifest
├── test_e2e.py              # Complete integration test script
└── README.md                # Project documentation
```

---

## 🚀 API Endpoint Reference

| Method | Route | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Register a new user account | No |
| `POST` | `/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/profile/me` | Retrieve active student profile & streak stats | Yes |
| `PUT` | `/profile/me` | Update learning preferences & target goals | Yes |
| `POST` | `/learning/submit-answer` | Submit quiz answer, update IRT ability ($	heta$), mastery & streak | Yes |
| `GET` | `/learning/recommend/{concept_id}` | Generate adaptive learning path with matched resources | Yes |

---

## ⚡ Quick Start Guide

### 1. Prerequisites
* Python 3.10 or higher
* `pip` package manager

### 2. Environment Setup & Installation

```bash
# Clone the repository
git clone https://github.com/your-org/Learn-Jam.git
cd Learn-Jam/backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Running the Server

```bash
uvicorn main:app --reload
```

The interactive OpenAPI / Swagger UI will be accessible at:
👉 **`http://127.0.0.1:8000/docs`**

---

## 🧪 Running End-to-End Integration Tests

To verify all layers (Auth, IRT Engine, DAG Traversal, Adaptive Orchestration, and Streak Updates):

```bash
# Ensure uvicorn server is running in a separate terminal
python test_e2e.py
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
