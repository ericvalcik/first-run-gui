import '@/app/globals.css'

import React, { useContext, useState } from 'react'
import { SXApiService } from '@/service/sxapi-service'
import { StateContext } from '@/pages/_app'

const Step12 = () => {
  const { state } = useContext(StateContext)
  const [value, setValue] = useState<number>(0)
  const [running, setRunning] = useState<boolean>(false)
  const [disabled, setDisabled] = useState<boolean>(false)

  const runMotor = async () => {
    setDisabled(true)
    setTimeout(() => {
      setDisabled(false)
    }, 1000)

    if (!state.handle) {
      throw new Error('No handle')
    }
    try {
      if (value === 0) {
        await SXApiService.exec(state.handle, 'stop')
        setRunning(false)
      } else {
        await SXApiService.run(state.handle, value)
        setRunning(true)
      }
    } catch (e) {
      // TODO handle error
    }
  }

  const stopMotor = async () => {
    if (!state.handle) {
      throw new Error('No handle')
    }
    try {
      await SXApiService.exec(state.handle, 'stop')
      setValue(0)
      setRunning(false)
    } catch (e) {
      // TODO handle error
    }
  }

  return (
    <div className="mainCol">
      <p style={{ marginBottom: '8px' }}>Run the motor.</p>
      <p className="subtitle" style={{ marginTop: '0px', marginBottom: '20px' }}>
        Everything was setup correctly, so now you can spin the motor! Note that motor is being run at lower intensity,
        just for demonstration purposes. Our controller is capable of delivering much more power.
      </p>
      <p className="subtitle" style={{ marginBottom: '20px' }}>
        Set the intensity for the motor, all the way to the left side on the slider is 0% and all the way to the right
        side is 100%. Note that the motor is now running
      </p>
      <div className="row g-3" style={{ width: '800px' }}>
        <div className="col-6">
          <input
            type="range"
            className="form-range w-[80%] h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            min="0"
            max="1"
            step="0.01"
            id="commandRange"
            defaultValue="0"
            value={value}
            onChange={(e) => setValue(e.target.valueAsNumber)}
          />
        </div>
        <div className="col-3" style={{ height: '100%', alignSelf: 'center' }}>
          <p className="subtitle">{Math.round(value * 100)} %</p>
        </div>
        <div className="flex mt-8">
          <button
            style={{ alignSelf: 'flex-end', marginRight: '40px' }}
            type="button"
            onClick={runMotor}
            disabled={disabled}
          >
            Run motor
          </button>
          {running ? (
            <button style={{ alignSelf: 'flex-end', marginRight: '40px' }} type="button" onClick={stopMotor}>
              STOP
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default Step12
