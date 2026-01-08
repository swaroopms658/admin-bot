import requests

API_KEY = "AIzaSyCBNW7cAm2rUndql6maVcb365xS9fXiahE"

url = "https://generativelanguage.googleapis.com/v1beta/models"
response = requests.get(url, params={"key": API_KEY})

print(response.json())
