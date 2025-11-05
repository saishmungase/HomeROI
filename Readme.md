# HomeROI
> **Stop Predicting. Start Prescribing.**

[cite_start]HomeROI is an AI-Powered Renovation ROI Engine designed to move beyond simple price prediction and actively prescribe profitable home upgrades. [cite: 7]

## 👥 Team Void

* [cite_start]Saish Mungase [cite: 8]
* [cite_start]Pruthviraj Chavan [cite: 8]
* [cite_start]Rohan Patil [cite: 8]
* [cite_start]Sunil Yedle [cite: 8]

## 🎯 Project Problem Statement
[cite_start]This project was built for the "House Price Prediction with Data Pipeline & Deployment" challenge. [cite: 9]

## ❓ The Problem: The "Multi-Trillion Dollar Guess"

[cite_start]The home improvement market is massive, but it operates on guesswork, [cite: 13, 15] [cite_start]which we call "Hope-Based Equity." [cite: 15]

* [cite_start]**A Market Flying Blind:** Americans spent a record **$567 BILLION** on home improvements and repairs in 2022. [cite: 18]
* [cite_start]**Widespread Fear:** The #1 fear for 40% of homeowners is that their renovation will go over budget and become a financial loss. [cite: 20]
* [cite_start]**The "ROI Gap":** Homeowners consistently guess wrong about value. [cite: 22] [cite_start]They often believe a major kitchen remodel has the best ROI, but data shows simpler upgrades like a garage door replacement or new siding can provide 2-3x the financial return. [cite: 23]

[cite_start]Existing tools like Zillow are **passive**; [cite: 43] [cite_start]they can show you a home's history but can't tell you what would happen if you renovated the kitchen. [cite: 43, 44] [cite_start]Basic ML predictors are "toys" that don't analyze the home's actual condition or prescribe actions. [cite: 47]

## 💡 Our Solution: The AI-Powered ROI Engine

[cite_start]HomeROI provides a simple, three-step process to find the most profitable upgrades for any property. [cite: 26]

1.  [cite_start]**STEP 1: INGEST (The URL)** [cite: 27]
    * [cite_start]The user pastes any live real estate URL (e.g., from Zillow, Redfin). [cite: 28]
    * [cite_start]Our Node.js backend scrapes all property data and images. [cite: 30]

2.  [cite_start]**STEP 2: ANALYZE (The "AI Magic")** [cite: 31]
    * [cite_start]Our Vision Model analyzes the property images. [cite: 34]
    * [cite_start]It quantifies the "condition" of key areas (e.g., Is the kitchen 'Dated', 'Average', or 'Modern'?). [cite: 35]

3.  [cite_start]**STEP 3: PRESCRIBE (The "Money" Slide)** [cite: 33]
    * [cite_start]Our ML Model (on Hugging Face) uses these AI-driven condition scores to simulate dozens of renovation scenarios. [cite: 36, 37]
    * [cite_start]The result is a simple, ranked list of the most profitable upgrades. [cite: 38]

## ✨ Why Us? We're a Profit Engine, Not a Predictor

[cite_start]We don't just give you a "boring number"; we give you a ranked list of actions to *increase* that number. [cite: 49, 50]

| Feature | THEM (Everyone Else) | US (HomeROI) |
| :--- | :--- | :--- |
| **The Goal** | [cite_start]Passive Prediction [cite: 50] | [cite_start]**Active Prescription** [cite: 50] |
| **The Data** | [cite_start]Static CSV Files [cite: 50] | [cite_start]**Live URL Scraping** [cite: 50] |
| **The "AI"** | [cite_start]1-D Model (numbers in) [cite: 50] | [cite_start]**Multimodal (Images + Text)** [cite: 50] |
| **The Question** | [cite_start]"What is it worth?" [cite: 50] | [cite_start]**"How do I make it worth more?"** [cite: 50] |
| **The Result** | [cite_start]A single, boring number [cite: 50] | [cite_start]**A Ranked List of ROI** [cite: 50] |

## 💻 Technology Stack

[cite_start]This project was built using a "No Credit Card" Hackathon Stack. [cite: 52]

### Frontend
* [cite_start]**Framework:** Next.js 14 / React & Tailwind [cite: 54]
* [cite_start]**Host:** Vercel [cite: 55]

### AI Vision (The "Eyes")
* [cite_start]**Model:** Gemini API [cite: 56]
* [cite_start]**Host:** Google AI Studio [cite: 58]

### Main Backend (The "Manager")
* [cite_start]**Framework:** Node.js (Robust Backend) [cite: 61]
* [cite_start]**Host:** Render [cite: 62]

### ML Model (The "Brain")
* [cite_start]**Framework:** Python / FastAPI / Scikit-learn [cite: 64]
* [cite_start]**Host:** Hugging Face Spaces [cite: 65]

## 🚀 The Future: This Isn't Just a Hack. [cite_start]It's a Business. [cite: 133]

We see clear paths for scaling HomeROI into a full-fledged business.

* [cite_start]**For Homeowners (B2C):** An ultimate tool for building personal wealth; a "personal AI home-equity consultant." [cite: 135]
* [cite_start]**For "Flippers" & Investors (B2B):** A SaaS platform to instantly analyze the profit potential of any property on the market before a visit. [cite: 137, 138]
* [cite_start]**For Real Estate Agents (B2B2C):** A co-branded tool to win listings by showing sellers exactly how to maximize their final sale price. [cite: 140]