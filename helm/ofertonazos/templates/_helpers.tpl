{{/*
Expand the name of the chart.
*/}}
{{- define "ofertonazos.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "ofertonazos.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s" $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "ofertonazos.labels" -}}
helm.sh/chart: {{ include "ofertonazos.name" . }}-{{ .Chart.Version }}
{{ include "ofertonazos.selectorLabels" . }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "ofertonazos.selectorLabels" -}}
app.kubernetes.io/name: {{ include "ofertonazos.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
