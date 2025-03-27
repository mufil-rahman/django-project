
from django.urls import path
from api.views import (
    CreateUserView,
    RecordList,
    RecordRetrieveUpdateDestroy
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('users/register/', CreateUserView.as_view(), name='user-register'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token-obtain'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('records/', RecordList.as_view(), name='record-list'),
    path('records/<int:pk>/', RecordRetrieveUpdateDestroy.as_view(), name='record-detail'),
]

