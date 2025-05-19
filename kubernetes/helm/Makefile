install:
	helm install imageflux ./challenge --values config/imageflux-values.yaml --namespace zeroday

template:
	helm template imageflux ./challenge --values config/imageflux-values.yaml --namespace zeroday

uninstall:
	helm uninstall imageflux --namespace zeroday
