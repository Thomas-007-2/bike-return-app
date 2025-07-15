import React from 'react'
import { CheckCircle, Battery, Lock } from 'lucide-react'

const ThankYou = ({ orderId }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Vielen Dank!
          </h1>
          <p className="text-lg text-gray-600">
            Deine Rückgabemeldung wurde erfolgreich übermittelt.
          </p>
        </div>

        <div className="card space-y-6">
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
              <Battery className="w-8 h-8 text-blue-600 mr-4 mt-1" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900 mb-1">
                  Bei E-Bike: aufladen nicht vergessen
                </h3>
                <p className="text-sm text-blue-700">
                  Bitte schließe das Ladegerät an, bevor Du den Raum verlässt.
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-orange-50 rounded-lg">
              <Lock className="w-8 h-8 text-orange-600 mr-4 mt-1" />
              <div className="text-left">
                <h3 className="font-medium text-orange-900 mb-1">
                  Raum abschließen
                </h3>
                <p className="text-sm text-orange-700">
                  Schließe die Tür und verriegele sie mit der Pfeiltaste auf dem Keypad außen.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThankYou