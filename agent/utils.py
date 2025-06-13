# utils.py
import yaml
import json

def load_yaml_config(path):
    with open(path, 'r') as f:
        return yaml.safe_load(f)

def load_json_file(path):
    with open(path, 'r') as f:
        return json.load(f)

def save_json_file(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)