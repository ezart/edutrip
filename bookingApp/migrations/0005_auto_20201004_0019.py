# Generated by Django 2.0.7 on 2020-10-03 21:19

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookingApp', '0004_auto_20180809_0941'),
    ]

    operations = [
        migrations.AlterField(
            model_name='institution',
            name='number_of_visitors',
            field=models.IntegerField(validators=[django.core.validators.MaxValueValidator(80), django.core.validators.MinValueValidator(1)]),
        ),
    ]