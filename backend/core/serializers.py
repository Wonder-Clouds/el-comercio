from rest_framework_simplejwt.serializers import TokenObtainSerializer

class CustomTokenObtainSerializer(TokenObtainSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['username'] = user.username
        token['email'] = user.email
        return token