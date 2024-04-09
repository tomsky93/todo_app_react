from django.urls import path, include
from .views import ToDoList, ToDoDetail, CategoryListView

urlpatterns = [
    path('api/todos/', ToDoList.as_view(), name='todo_list'),
    path('api/todos/<int:pk>/', ToDoDetail.as_view(), name='todo_detail'),
    path('api/categories/', CategoryListView.as_view(), name='category-list'),
  
]