import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OrdinalEncoder, OneHotEncoder
import joblib
import os

# Load the Ames housing dataset
print("Loading Ames housing dataset...")

# Option 1: Load from local file (recommended)
if os.path.exists('train.csv'):
    print("Loading from local train.csv file...")
    df = pd.read_csv('train.csv')
else:
    # Option 2: Download from a working URL
    print("Downloading dataset from Kaggle mirror...")
    try:
        # This is the actual Ames Housing dataset from Kaggle
        url = 'https://raw.githubusercontent.com/PacktPublishing/Hands-On-Data-Science-and-Python-Machine-Learning/master/house-prices-advanced-regression-techniques/train.csv'
        df = pd.read_csv(url)
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("\nPlease download the Ames dataset manually:")
        print("1. Go to: https://www.kaggle.com/competitions/house-prices-advanced-regression-techniques/data")
        print("2. Download 'train.csv'")
        print("3. Place it in the same directory as this script")
        print("4. Run the script again")
        exit(1)

print(f"Dataset loaded successfully! Shape: {df.shape}")

# Define features
numeric_features = ['LotArea', 'OverallQual', 'OverallCond', 'YearBuilt', 'GrLivArea', 'TotRmsAbvGrd', 'FullBath']
quality_features = ['ExterQual', 'KitchenQual', 'BsmtQual']
nominal_features = ['Neighborhood', 'BldgType']

# All features combined
all_features = numeric_features + quality_features + nominal_features

# Check if all required columns exist
missing_cols = [col for col in all_features if col not in df.columns]
if missing_cols:
    print(f"Error: Missing columns in dataset: {missing_cols}")
    print(f"Available columns: {df.columns.tolist()}")
    exit(1)

# Prepare X and y
X = df[all_features].copy()
y = df['SalePrice']

print(f"Features: {all_features}")
print(f"Training samples: {len(X)}")
print(f"Target variable: SalePrice (mean: ${y.mean():,.2f})")

# Define the quality order
quality_order = ['Po', 'Fa', 'TA', 'Gd', 'Ex']

# Create preprocessing pipelines for each feature type
numeric_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='median'))
])

quality_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('ordinal', OrdinalEncoder(categories=[quality_order] * len(quality_features), 
                               handle_unknown='use_encoded_value', 
                               unknown_value=-1))
])

nominal_transformer = Pipeline(steps=[
    ('imputer', SimpleImputer(strategy='most_frequent')),
    ('onehot', OneHotEncoder(handle_unknown='ignore'))
])

# Combine all transformers
preprocessor = ColumnTransformer(
    transformers=[
        ('num', numeric_transformer, numeric_features),
        ('qual', quality_transformer, quality_features),
        ('nom', nominal_transformer, nominal_features)
    ])

# Create the full pipeline with the model
model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1))
])

# Train the model
print("\nTraining the model...")
model_pipeline.fit(X, y)

# Calculate training score
train_score = model_pipeline.score(X, y)
print(f"Training R² score: {train_score:.4f}")

# Save the trained pipeline
print("\nSaving model to model.pkl...")
joblib.dump(model_pipeline, 'model.pkl')

# Get model file size
model_size = os.path.getsize('model.pkl') / (1024 * 1024)  # Convert to MB
print(f"Model saved successfully! (Size: {model_size:.2f} MB)")

# Test prediction with sample data
print("\n" + "="*50)
print("Testing model with sample prediction...")
sample = X.iloc[0:1].copy()
prediction = model_pipeline.predict(sample)
actual = y.iloc[0]
print(f"Sample prediction: ${prediction[0]:,.2f}")
print(f"Actual price: ${actual:,.2f}")
print(f"Difference: ${abs(prediction[0] - actual):,.2f}")
print("="*50)

print("\n✅ Training complete! You can now run 'uvicorn main:app --reload' to test the API locally.")