# Generated by Django 2.0.7 on 2018-07-21 09:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookingApp', '0010_addedApprovedColumn'),
    ]

    operations = [
        migrations.AlterField(
            model_name='powerstation',
            name='available',
            field=models.BooleanField(default=True),
        ),
    ]
