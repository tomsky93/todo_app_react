from rest_framework import serializers
from .models import ToDo, ToDoCategory

class ToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDo
        fields = ['id', 'title', 'description', 'completed', 'category', 'due_date']
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ToDoCategory
        fields = '__all__'




        