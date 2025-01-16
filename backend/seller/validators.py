from django.core.exceptions import ValidationError

def validate_no_spaces(value):
    if ' ' in value:
        raise ValidationError('This field cannot contain spaces.')

def validate_is_number(value):
    if not value.isdigit():
        raise ValidationError('This field must be a number.')