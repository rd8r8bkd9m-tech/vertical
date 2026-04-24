export const plasteringVertical = {
  id: 'plastering',
  name: 'Штукатурка',
  description: 'Механизированная и ручная штукатурка стен, материалы, подъём, антидоп.',
  quickInputs: [
    'wallAreaM2',
    'averageLayerMm',
    'baseType',
    'materialOwner',
    'floor',
    'hasElevator',
    'includeSlopes'
  ],
  requiredAntidopChecks: [
    'layerSpecified',
    'materialOwnerSpecified',
    'liftChecked',
    'slopesChecked',
    'primerChecked',
    'beaconsChecked'
  ]
} as const;
