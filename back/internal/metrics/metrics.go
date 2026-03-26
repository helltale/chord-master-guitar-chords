package metrics

import (
	"database/sql"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/prometheus/client_golang/prometheus"
	"github.com/prometheus/client_golang/prometheus/promhttp"
)

type Metrics struct {
	reqTotal    *prometheus.CounterVec
	reqDuration *prometheus.HistogramVec
	songOpens   prometheus.Counter

	dbOpenConnections  prometheus.GaugeFunc
	dbInUseConnections prometheus.GaugeFunc
	dbIdleConnections  prometheus.GaugeFunc
}

func New(reg *prometheus.Registry, sqlDB *sql.DB) *Metrics {
	m := &Metrics{}

	m.reqTotal = prometheus.NewCounterVec(
		prometheus.CounterOpts{
			Name: "http_requests_total",
			Help: "Total HTTP requests, partitioned by method, route pattern and status code.",
		},
		[]string{"method", "route", "status"},
	)
	m.reqDuration = prometheus.NewHistogramVec(
		prometheus.HistogramOpts{
			Name:    "http_request_duration_seconds",
			Help:    "HTTP request duration in seconds, partitioned by method and route pattern.",
			Buckets: prometheus.DefBuckets,
		},
		[]string{"method", "route"},
	)
	m.songOpens = prometheus.NewCounter(
		prometheus.CounterOpts{
			Name: "song_opens_total",
			Help: "Total number of recorded song page opens.",
		},
	)

	reg.MustRegister(m.reqTotal, m.reqDuration, m.songOpens)

	if sqlDB != nil {
		m.dbOpenConnections = prometheus.NewGaugeFunc(
			prometheus.GaugeOpts{
				Name: "db_open_connections",
				Help: "Current number of open connections in the database/sql pool.",
			},
			func() float64 {
				stats := sqlDB.Stats()
				return float64(stats.OpenConnections)
			},
		)
		m.dbInUseConnections = prometheus.NewGaugeFunc(
			prometheus.GaugeOpts{
				Name: "db_in_use_connections",
				Help: "Current number of in-use connections in the database/sql pool.",
			},
			func() float64 {
				stats := sqlDB.Stats()
				return float64(stats.InUse)
			},
		)
		m.dbIdleConnections = prometheus.NewGaugeFunc(
			prometheus.GaugeOpts{
				Name: "db_idle_connections",
				Help: "Current number of idle connections in the database/sql pool.",
			},
			func() float64 {
				stats := sqlDB.Stats()
				return float64(stats.Idle)
			},
		)
		reg.MustRegister(m.dbOpenConnections, m.dbInUseConnections, m.dbIdleConnections)
	}

	return m
}

func (m *Metrics) IncSongOpens() {
	m.songOpens.Inc()
}

func (m *Metrics) Handler(reg *prometheus.Registry) http.Handler {
	return promhttp.HandlerFor(reg, promhttp.HandlerOpts{})
}

type statusRecorder struct {
	http.ResponseWriter

	status int
}

func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

func (r *statusRecorder) Write(b []byte) (int, error) {
	if r.status == 0 {
		r.status = http.StatusOK
	}
	return r.ResponseWriter.Write(b)
}

func (m *Metrics) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/metrics" {
			next.ServeHTTP(w, r)
			return
		}

		routePattern := chi.RouteContext(r.Context()).RoutePattern()
		if routePattern == "" {
			routePattern = r.URL.Path
		}

		rec := &statusRecorder{ResponseWriter: w}

		start := time.Now()
		next.ServeHTTP(rec, r)
		durationSeconds := time.Since(start).Seconds()

		statusCode := rec.status
		if statusCode == 0 {
			statusCode = http.StatusOK
		}

		m.reqTotal.WithLabelValues(r.Method, routePattern, strconv.Itoa(statusCode)).Inc()
		m.reqDuration.WithLabelValues(r.Method, routePattern).Observe(durationSeconds)
	})
}
