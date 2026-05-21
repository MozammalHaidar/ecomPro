from django.db import models


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True)
    email = models.EmailField(blank=True)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField()
    avatar_letter = models.CharField(max_length=1, blank=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} - {self.rating}★'

    def save(self, *args, **kwargs):
        if self.name and not self.avatar_letter:
            self.avatar_letter = self.name[0].upper()
        super().save(*args, **kwargs)
