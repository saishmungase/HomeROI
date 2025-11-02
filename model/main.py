from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import joblib
import os

# Initialize FastAPI app
app = FastAPI(title="HomeROI Price Predictor", version="1.0.0")

# Load the trained model
model_path = "model.pkl"
if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file {model_path} not found. Please ensure model.pkl is in the same directory.")

model = joblib.load(model_path)

# Define the input features schema
class HouseFeatures(BaseModel):
    LotArea: float
    OverallQual: int
    OverallCond: int
    YearBuilt: int
    GrLivArea: float
    TotRmsAbvGrd: int
    FullBath: int
    ExterQual: Optional[str] = None
    KitchenQual: Optional[str] = None
    BsmtQual: Optional[str] = None
    Neighborhood: Optional[str] = None
    BldgType: Optional[str] = None

    class Config:
        schema_extra = {
            "example": {
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
        }

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "message": "HomeROI Price Predictor API is running",
        "version": "1.0.0"
    }

@app.post("/predict")
def predict(features: HouseFeatures):
    """
    Predict house price based on input features
    """
    try:
        # Convert Pydantic model to dictionary
        features_dict = features.dict()
        
        # Create a DataFrame with the correct column order
        # This matches the order used in training
        df = pd.DataFrame([{
            'LotArea': features_dict['LotArea'],
            'OverallQual': features_dict['OverallQual'],
            'OverallCond': features_dict['OverallCond'],
            'YearBuilt': features_dict['YearBuilt'],
            'GrLivArea': features_dict['GrLivArea'],
            'TotRmsAbvGrd': features_dict['TotRmsAbvGrd'],
            'FullBath': features_dict['FullBath'],
            'ExterQual': features_dict['ExterQual'],
            'KitchenQual': features_dict['KitchenQual'],
            'BsmtQual': features_dict['BsmtQual'],
            'Neighborhood': features_dict['Neighborhood'],
            'BldgType': features_dict['BldgType']
        }])
        
        # Make prediction
        prediction = model.predict(df)
        predicted_price = float(prediction[0])
        
        return {
            "predicted_price": round(predicted_price, 2),
            "status": "success"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "api_version": "1.0.0"
    }