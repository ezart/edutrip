# Generated by Django 2.0.7 on 2018-08-08 09:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bookingApp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PowerStation',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(choices=[('Masinga', 'Masinga'), ('Kamburu', 'Kamburu'), ('Gitaru', 'Gitaru'), ('Kindaruma', 'Kindaruma'), ('Kiambere', 'Kiambere')], max_length=20)),
                ('available', models.BooleanField(default=True)),
                ('unavailable_from', models.DateField(blank=True, null=True)),
                ('unavailable_until', models.DateField(blank=True, null=True)),
            ],
        ),
    ]
