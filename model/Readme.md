---
title: HomeROI Price Predictor
emoji: 🏠
colorFrom: indigo
colorTo: purple
sdk: docker
app_port: 7860
---

# HomeROI Price Predictor

A machine learning API for predicting house prices in Ames, Iowa using quality features and property characteristics.

## Features

This model predicts house prices based on:

**Numeric Features:**
- LotArea
- OverallQual
- OverallCond
- YearBuilt
- GrLivArea
- TotRmsAbvGrd
- FullBath

**Quality Features (from Vision AI):**
- ExterQual
- KitchenQual
- BsmtQual

**Categorical Features:**
- Neighborhood
- BldgType

## API Endpoints

### `GET /`
Health check endpoint

### `POST /predict`
Predict house price based on input features

**Example Request:**
```json
{
  "LotArea": 8450.0,
  "OverallQual": 7,
  "OverallCond": 5,
  "YearBuilt": 2003,
  "GrLivArea": 1710.0,
  "TotRmsAbvGrd": 8,
  "FullBath": 2,
  "ExterQual": "Gd",
  "KitchenQual": "Gd",
  "BsmtQual": "Gd",
  "Neighborhood": "CollgCr",
  "BldgType": "1Fam"
}
```

**Example Response:**
```json
{
  "predicted_price": 185000.0,
  "status": "success"
}
```

## Local Development

1. Train the model:
```bash
python train.py
```

2. Run the API locally:
```bash
uvicorn main:app --reload
```

## Deployment

This application is configured for automatic deployment on Hugging Face Spaces using Docker.