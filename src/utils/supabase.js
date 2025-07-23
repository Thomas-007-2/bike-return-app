import {createClient} from '@supabase/supabase-js' 

const supabaseUrl=import.meta.env.VITE_SUPABASE_URL 
const supabaseKey=import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase=createClient(supabaseUrl,supabaseKey)

export const createReport = async (orderId, status, description, merchantId) => {
  const {data, error} = await supabase
    .from('return_reports')
    .insert([
      {
        order_id: orderId,
        merchant_id: merchantId,
        status,
        description,
        created_at_vienna: new Date().toLocaleString('en-CA', {
          timeZone: 'Europe/Vienna',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/,/g, '')
      }
    ])
    .select()
  
  if (error) throw error
  return data[0]
}

export const uploadPhoto = async (file, orderId, merchantId) => {
  // Generate unique filename 
  const fileExt = 'jpg' // Always use jpg extension for compressed images
  const fileName = `${orderId}_${Date.now()}.${fileExt}` 
  const filePath = `${merchantId}/${orderId}/${fileName}` 

  // Upload file to storage 
  const {data: uploadData, error: uploadError} = await supabase.storage 
    .from('return-photos') 
    .upload(filePath, file, {
      contentType: 'image/jpeg' // Set content type to JPEG
    }) 

  if (uploadError) throw uploadError 

  // Create photo record 
  const {data: photoData, error: photoError} = await supabase 
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

  return {upload: uploadData, photo: photoData[0]}
}
export const callWebhook = async (orderId, storeId) => {
  try {
    const response = await fetch('https://cloud.activepieces.com/api/v1/webhooks/ZQWjCysxyz4YAUgjMQSeb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        order_id: orderId,
        store_id: storeId,
        all_ok: 'yes'
      })
    });

    if (!response.ok) {
      throw new Error(`Webhook call failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log('Webhook called successfully:', result);
    return result;
  } catch (error) {
    console.error('Error calling webhook:', error);
    throw error;
  }
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
