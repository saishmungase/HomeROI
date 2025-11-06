# HomeROI
> **Stop Predicting. Start Prescribing.**

HomeROI is an AI-Powered Renovation ROI Engine designed to move beyond simple price prediction and actively prescribe profitable home upgrades.

## 👥 Team Void

* Saish Mungase
* Pruthviraj Chavan
* Rohan Patil
* Sunil Yedle

## 🎯 Project Problem Statement
This project was built for the "House Price Prediction with Data Pipeline & Deployment" challenge.

## ❓ The Problem: The "Multi-Trillion Dollar Guess"

The home improvement market is massive, but it operates on guesswork, which we call "Hope-Based Equity."

* **A Market Flying Blind:** Americans spent a record **$567 BILLION** on home improvements and repairs in 2022.
* **Widespread Fear:** The #1 fear for 40% of homeowners is that their renovation will go over budget and become a financial loss.
* **The "ROI Gap":** Homeowners consistently guess wrong about value. They often believe a major kitchen remodel has the best ROI, but data shows simpler upgrades like a garage door replacement or new siding can provide 2-3x the financial return.

Existing tools like Zillow are **passive**; they can show you a home's history but can't tell you what would happen if you renovated the kitchen. Basic ML predictors are "toys" that don't analyze the home's actual condition or prescribe actions.

## 💡 Our Solution: The AI-Powered ROI Engine

HomeROI provides a simple, three-step process to find the most profitable upgrades for any property.

1.  **STEP 1: INGEST (The URL)**
    * The user pastes any live real estate URL (e.g., from Zillow, Redfin).
    * Our Node.js backend scrapes all property data and images.

2.  **STEP 2: ANALYZE (The "AI Magic")**
    * Our Vision Model analyzes the property images.
    * It quantifies the "condition" of key areas (e.g., Is the kitchen 'Dated', 'Average', or 'Modern'?).

3.  **STEP 3: PRESCRIBE (The "Money" Slide)**
    * Our ML Model (on Hugging Face) uses these AI-driven condition scores to simulate dozens of renovation scenarios.
    * The result is a simple, ranked list of the most profitable upgrades.

## ✨ Why Us? We're a Profit Engine, Not a Predictor

We don't just give you a "boring number"; we give you a ranked list of actions to *increase* that number.

| Feature | THEM (Everyone Else) | US (HomeROI) |
| :--- | :--- | :--- |
| **The Goal** | Passive Prediction | **Active Prescription** |
| **The Data** | Static CSV Files | **Live URL Scraping** |
| **The "AI"** | 1-D Model (numbers in) | **Multimodal (Images + Text)** |
| **The Question** | "What is it worth?" | **"How do I make it worth more?"** |
| **The Result** | A single, boring number | **A Ranked List of ROI** |

## 💻 Technology Stack

This project was built using a "No Credit Card" Hackathon Stack.

### Frontend
* **Framework:** Next.js 14 / React & Tailwind
* **Host:** Vercel

### AI Vision (The "Eyes")
* **Model:** Gemini API
* **Host:** Google AI Studio

### Main Backend (The "Manager")
* **Framework:** Node.js (Robust Backend)
* **Host:** Render

### ML Model (The "Brain")
* **Framework:** Python / FastAPI / Scikit-learn
* **Host:** Hugging Face Spaces

## 🚀 The Future: This Isn't Just a Hack. It's a Business.

We see clear paths for scaling HomeROI into a full-fledged business.

* **For Homeowners (B2C):** An ultimate tool for building personal wealth; a "personal AI home-equity consultant."
* **For "Flippers" & Investors (B2B):** A SaaS platform to instantly analyze the profit potential of any property on the market before a visit.
* **For Real Estate Agents (B2B2C):** A co-branded tool to win listings by showing sellers exactly how to maximize their final sale price.