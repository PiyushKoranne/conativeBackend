#include<iostream>
using namespace std;
//Bubble Sort
int main()
{
    int n, i, temp, count;
    cin>>n;
    int arr[n]; 
    for(i=0;i<n;i++){
     cin>>arr[i];
    
    }
    for(count = 1;count<n; count++){
      for(i = 0; i<n-count; i++){
        if(arr[i]>arr[i+1]){
         temp = arr[i+1];
         arr[i+1]=arr[i];
         arr[i]=temp;
        }
    }
    }
    cout<<"sorted array : ";
    for(i=0; i<n;i++){
       cout<<arr[i]<<" ";
    }
    
    return 0;
}

