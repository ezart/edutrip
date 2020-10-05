from django.test import TestCase
from .models import Institution


class InstitutionTestCase(TestCase):
    def setUp(self):
        Institution.objects.create(name="Parkland Boys", po_box="113 Parklands rd",
                                   city="Nairobi", number_of_visitors=23, email="teacher@example.com")

    def test_institution_name(self):
        """Output name of school"""
        school = Institution.objects.get(name="Parkland Boys")
        self.assertEqual(school.__str__(), 'Parkland Boys')
