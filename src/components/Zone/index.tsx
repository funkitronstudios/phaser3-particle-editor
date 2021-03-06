import React, { Component, Fragment } from 'react';
import { EMITTER_STORE } from '../../stores';
import { observer, inject } from 'mobx-react';
import { EmitterStoreProp } from '../../stores/emitterStore';
import Switch from '../Switch';
import { getZoneShapeProps } from '../../utils';
import { Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import Select from '../Select';
import ComplexTextField from '../ComplexTextField';

interface Props {
  configName: string;
  types: [string, string];
  onEnable?: (zoneValue: any) => any;
  onTypeChange?: (zoneValue: any, type: string) => any;
  options: any;
}

@inject(EMITTER_STORE)
@observer
class Zone extends Component<Props & EmitterStoreProp> {
  getZoneTypeRadioButtons() {
    const { configName, types, emitterStore, onTypeChange } = this.props;
    const { currentEmitterConfig, changeEmitterConfig } = emitterStore!;
    const zone = currentEmitterConfig[configName];

    return (
      <RadioGroup
        value={zone.type}
        onChange={(e, value) => {
          let zoneValue = { ...zone, type: value };
          zoneValue = onTypeChange ? onTypeChange(zoneValue, value) : zoneValue;
          changeEmitterConfig(configName, zoneValue);
        }}
      >
        <FormControlLabel
          value={types[0]}
          control={<Radio />}
          label={types[0]}
        />
        <FormControlLabel
          value={types[1]}
          control={<Radio />}
          label={types[1]}
        />
      </RadioGroup>
    );
  }

  render() {
    const { configName, types, emitterStore, onEnable, options } = this.props;
    const {
      currentEmitter,
      currentEmitterConfig,
      changeEmitterConfig,
      changeDebugMode,
    } = emitterStore!;
    const zone = currentEmitterConfig[configName];

    return (
      <Fragment>
        <Switch
          checked={zone !== undefined}
          label="Enable"
          onChange={event => {
            let zoneValue = event.target.checked
              ? { ...getZoneShapeProps('Rectangle'), type: types[0] }
              : undefined;
            zoneValue = zoneValue && onEnable ? onEnable(zoneValue) : zoneValue;
            changeEmitterConfig(configName, zoneValue);
          }}
        />
        {zone ? (
          <Fragment>
            {this.getZoneTypeRadioButtons()}
            <Switch
              checked={currentEmitter.debugModes[configName]}
              label="Debug mode"
              onChange={event => {
                changeDebugMode(configName, event.target.checked);
              }}
            />
            <Select
              configName={`${configName}>source`}
              options={options}
              value={zone.shapeType}
              onChange={event => {
                const zoneValue = {
                  ...zone,
                  ...getZoneShapeProps(event.target.value),
                };
                changeEmitterConfig(configName, zoneValue);
              }}
            />
            <ComplexTextField configName={`${configName}>source`} />
          </Fragment>
        ) : null}
      </Fragment>
    );
  }
}

export default Zone;
