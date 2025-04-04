# Generated by Django 4.2.20 on 2025-03-30 18:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('songs', '0001_initial'),
        ('artists', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='artist',
            name='genres',
            field=models.ManyToManyField(to='songs.genres'),
        ),
        migrations.AddField(
            model_name='artist',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='follow',
            unique_together={('artist', 'user')},
        ),
    ]
