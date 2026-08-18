export const name = 'dhp-project-policy'

const LOCKED_POLICY = Object.freeze({
  project: 'dai-hai-phat',
  routingMode: 'free-cloud-only',
  routerSource: '.ai/FREE_MODEL_ROUTER.json',
  providerRegistry: 'tools/dsh-dhp-bundle/provider-registry.json',
  preferredProvider: 'dhp-free',
  skillsSource: '.dsh/skills',
  paidFallback: false,
  localLlmFallback: false,
  qualityGate: 'npm run quality',
})

export function apply(_ctx, config = {}) {
  const policy = { ...LOCKED_POLICY, ...config }

  if (policy.routingMode !== 'free-cloud-only') {
    throw new Error('[DHP] routingMode must remain free-cloud-only')
  }
  if (policy.preferredProvider !== 'dhp-free') {
    throw new Error('[DHP] preferredProvider must remain dhp-free')
  }
  if (policy.paidFallback !== false) {
    throw new Error('[DHP] automatic paid fallback is forbidden')
  }
  if (policy.localLlmFallback !== false) {
    throw new Error('[DHP] local LLM/Ollama fallback is forbidden')
  }
  if (policy.qualityGate !== 'npm run quality') {
    throw new Error('[DHP] repository quality gate must remain npm run quality')
  }

  console.log(
    `[DHP] policy loaded: ${policy.routingMode}; provider=${policy.preferredProvider}; skills=${policy.skillsSource}; router=${policy.routerSource}`,
  )
}
