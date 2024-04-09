from django.db import models

class ToDo(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    category = models.ForeignKey('ToDoCategory', on_delete=models.CASCADE, related_name='todos', null=True, blank=True)
    due_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.title

    class Meta:
        ordering = ['due_date']


class ToDoCategory(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name

