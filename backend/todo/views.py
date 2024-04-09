from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .models import ToDo, ToDoCategory
from .serializers import ToDoSerializer, CategorySerializer
from datetime import datetime, timedelta

class ToDoList(APIView):

    def get(self, request):
        category_id = request.query_params.get('category')
        filter_date = request.query_params.get('due_date')

        todos = ToDo.objects.all()
        
        if category_id:
            todos = todos.filter(category__id=category_id)

        today = datetime.now().date()
        
        if filter_date == 'today':
            tomorrow = today + timedelta(days=1)
            todos = todos.filter(due_date__range=[today, tomorrow])
        elif filter_date == 'next7days':
            next_7_days = today + timedelta(days=7)
            todos = todos.filter(due_date__range=[today, next_7_days])
        elif filter_date == 'overdue':
            todos = todos.filter(due_date__lt=today, completed=False)
        elif filter_date == 'noduedate':
            todos = todos.filter(due_date=None)

        serializer = ToDoSerializer(todos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ToDoSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save()   
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ToDoDetail(generics.GenericAPIView):
    serializer_class = ToDoSerializer

    def get_queryset(self):
        return ToDo.objects.all()

    def get_object(self):
        pk = self.kwargs.get('pk')
        return generics.get_object_or_404(self.get_queryset(), pk=pk)

    def get(self, request, *args, **kwargs):
        todo = self.get_object()
        serializer = self.get_serializer(todo)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        todo = self.get_object()
        serializer = self.get_serializer(todo, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        todo = self.get_object()
        todo.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class CategoryListView(APIView):
    
    def get(self, request):
        if request.query_params.get('category'):
            category_id = request.query_params.get('category')
            categories = ToDoCategory.objects.filter(id=category_id)
                   
        categories = ToDoCategory.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    

