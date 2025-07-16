import {createClient} from '@supabase/supabase-js' 

const supabaseUrl=import.meta.env.VITE_SUPABASE_URL 
const supabaseKey=import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase=createClient(supabaseUrl,supabaseKey)

export const createReport=async (orderId,status,description,merchantId)=> {
const {data,error}=await supabase 
.from('return_reports') 
.insert([ 
{
order_id: orderId,
merchant_id: merchantId,
status,
description,
created_at_vienna: new Date().toLocaleString('en-CA',{
timeZone: 'Europe/Vienna',
year: 'numeric',
month: '2-digit',
day: '2-digit',
hour: '2-digit',
minute: '2-digit',
second: '2-digit',
hour12: false
}).replace(/,/g,'')
} 
]) 
.select() 

if (error) throw error 
return data[0]
}

export const uploadPhoto=async (file,orderId,merchantId)=> {
// Generate unique filename 
const fileExt=file.name.split('.').pop() 
const fileName=`${orderId}_${Date.now()}.${fileExt}` 
const filePath=`${merchantId}/${orderId}/${fileName}` 

// Upload file to storage 
const {data: uploadData,error: uploadError}=await supabase.storage 
.from('return-photos') 
.upload(filePath,file) 

if (uploadError) throw uploadError 

// Create photo record 
const {data: photoData,error: photoError}=await supabase 
.from('return_photos') 
.insert([ 
{
order_id: orderId,
merchant_id: merchantId,
file_name: fileName,
file_path: filePath
} 
]) 
.select() 

if (photoError) throw photoError 

return {upload: uploadData,photo: photoData[0]}
}

export const getMerchantConfig=async (merchantId)=> {
const {data,error}=await supabase 
.from('merchant_configurations') 
.select('*') 
.eq('merchant_id',merchantId) 
.single() 

if (error) {
console.warn('No merchant configuration found for:',merchantId,'Using defaults')
return null
}

return data
}