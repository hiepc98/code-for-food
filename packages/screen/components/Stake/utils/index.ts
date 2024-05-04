export const checkCurrentStep = (currentStep: string, step: string) => {
  if (currentStep === step) {
    return true
  }
  return false
}
