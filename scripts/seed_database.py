#!/usr/bin/env python3
"""
Seed script to load German Credit dataset into MongoDB.
This script attempts to load data from an Excel file or falls back to CSV.
"""
import os
import time
import pandas as pd
from pymongo import MongoClient

def wait_for_mongodb(uri, max_retries=30, delay=2):
    """Wait for MongoDB to become available"""
    client = MongoClient(uri)
    for i in range(max_retries):
        try:
            # The ismaster command is cheap and does not require auth
            client.admin.command('ismaster')
            print("MongoDB is available!")
            return client
        except Exception as e:
            if i < max_retries - 1:
                print(f"MongoDB not yet available, waiting... ({i+1}/{max_retries})")
                time.sleep(delay)
            else:
                raise Exception("Could not connect to MongoDB after retries") from e
    return None

def load_dataset(file_path):
    """
    Load the German Credit dataset from file.
    Attempts to load as Excel first, then falls back to CSV if needed.
    """
    try:
        # First try to load as Excel
        print(f"Loading dataset from {file_path} using Excel engine...")
        df = pd.read_excel(file_path, engine='openpyxl')
    except Exception as e:
        print(f"Excel load failed: {str(e)}")
        # If Excel fails, try with xlrd engine (for older .xls files)
        try:
            print("Trying with xlrd engine...")
            df = pd.read_excel(file_path, engine='xlrd')
        except Exception as xlrd_error:
            print(f"xlrd load failed: {str(xlrd_error)}")
            # If that fails, treat it as CSV (some .xls files are actually CSV)
            print("Falling back to CSV parser...")
            df = pd.read_csv(file_path)
    
    # Clean up the dataframe - drop Unnamed column if it exists
    if 'Unnamed: 0' in df.columns:
        df = df.drop('Unnamed: 0', axis=1)
    
    return df

def main():
    # Get configuration from environment
    mongo_uri = os.environ.get("MONGO_URI", "mongodb://mongodb:27017/german_credit")
    dataset_path = os.environ.get("DATASET_PATH", "/app/german_credit_data.xls")
    
    # Wait for MongoDB to be ready
    client = wait_for_mongodb(mongo_uri)
    
    # Get database name from URI
    db_name = mongo_uri.split('/')[-1]
    db = client[db_name]
    collection = db['reports']
    
    # Check if collection already has data
    count = collection.count_documents({})
    if count > 0:
        print(f"Collection already has {count} documents, skipping seed.")
        return
    
    # Load dataset
    df = load_dataset(dataset_path)
    
    # Convert DataFrame to list of dictionaries for MongoDB
    records = df.to_dict('records')
    
    # Insert into MongoDB
    result = collection.insert_many(records)
    print(f"Seeded {len(result.inserted_ids)} documents into {db_name}.reports")

if __name__ == "__main__":
    main()