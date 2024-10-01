import calendar
import json
from datetime import datetime
import pandas as pd

def load_json(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def save_json(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

def convert_data():
    acc_data = load_json('acc.json')
    question_metas = acc_data['question_metas']
    model_acc = acc_data['model_acc']

    performances = []
    models = []

    for model_name, questions in model_acc.items():
        models.append({
            'model_name': model_name,
            'model_repr': model_name,
            'model_style': model_name,
            'release_date': int(datetime.strptime('2022-12', '%Y-%m').timestamp() * 1000),
            'link': None
        })
        
        for question_id, details in questions.items():
            meta = question_metas[question_id]
            performances.append({
                'question_id': question_id,
                'model': model_name,
                'date': int(datetime.strptime(meta['date'], '%Y-%m').timestamp() * 1000),
                'difficulty': meta['ans_diff'],
                'pass@1': details['pass@1']*100,
                'platform': 'AOPS'
            })

    date_marks = []
    for year in range(2022, 2025):
        start_month = 12 if year == 2022 else 1
        end_month = 9 if year == 2024 else 12
        for month in range(start_month, end_month + 1):
            last_day = calendar.monthrange(year, month)[1]
            timestamp = int(datetime(year, month, last_day).timestamp() * 1000)
            date_marks.append(timestamp)

    return {'performances': performances, 'models': models, 'date_marks': date_marks}

# 执行转换并保存结果
result = convert_data()
save_json(result, 'acc_new.json')
