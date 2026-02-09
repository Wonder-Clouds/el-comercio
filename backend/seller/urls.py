from rest_framework import routers
from .views import SellerViewSet

router = routers.DefaultRouter()
router.register(r'sellers', SellerViewSet)

urlpatterns = router.urls
