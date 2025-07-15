import React from 'react'
import { CheckCircle, Battery, Lock } from 'lucide-react'
import i18n from '../utils/i18n'

const ThankYou = ({ orderId }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {i18n.t('thankYou')}
          </h1>
          <p className="text-lg text-gray-600">
            {i18n.t('submissionSuccess')}
          </p>
        </div>

        <div className="card space-y-6">
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-50 rounded-lg">
              <Battery className="w-8 h-8 text-blue-600 mr-4 mt-1" />
              <div className="text-left">
                <h3 className="font-medium text-blue-900 mb-1">
                  {i18n.t('chargeBike')}
                </h3>
                <p className="text-sm text-blue-700">
                  {i18n.t('chargeDescription')}
                </p>
              </div>
            </div>

            <div className="flex items-start p-4 bg-orange-50 rounded-lg">
              <Lock className="w-8 h-8 text-orange-600 mr-4 mt-1" />
              <div className="text-left">
                <h3 className="font-medium text-orange-900 mb-1">
                  {i18n.t('lockRoom')}
                </h3>
                <p className="text-sm text-orange-700">
                  {i18n.t('lockDescription')}
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