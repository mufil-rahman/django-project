from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework.response import Response
from .serializers import UserSerializer , RecordSerializer
from .models import Record
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
import os
load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class RecordList(generics.ListCreateAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]
    
class RecordRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Record.objects.all()
    serializer_class = RecordSerializer
    permission_classes = [IsAuthenticated]

class CRMQuestionAnsweringView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        question = request.data.get("question")
        if not question:
            return Response({"error": "Question is required."}, status=400)

        records = Record.objects.all()

        serialized_records = RecordSerializer(records, many=True).data

        

        llm = ChatGoogleGenerativeAI(
            model="gemini-2.0-flash",
            temperature=0.7,
            google_api_key=GEMINI_API_KEY
        )

        prompt = PromptTemplate(
            input_variables=["question"],
            template="You are a CRM assistant. Answer the following question: {question} based on the records: {serialized_records}. No formatting, just the plain answer.",
        )

        chain = prompt | llm

        response = chain.invoke({"question": question , "serialized_records": serialized_records})
        if not response:
            return Response({"error": "No response from the model."}, status=500)

        return Response({"answer": response.content if hasattr(response, 'content') else response['text']}, status=200)