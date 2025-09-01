# 🎨 Sketcha - Sistema de Pagos y Créditos

## 📋 **Resumen del Sistema**

Sketcha es una aplicación de colorización de imágenes con IA que implementa un sistema de créditos y pagos. Los usuarios reciben **1 crédito gratuito** al registrarse y deben comprar planes para continuar usando el servicio.

## 🏗️ **Arquitectura del Sistema**

### **Componentes Principales:**

1. **Frontend (React + Next.js)**
   - Componente de autenticación
   - Interfaz de colorización
   - Modal de planes de pago
   - Gestión de créditos en tiempo real

2. **Backend (API Routes)**
   - Autenticación de usuarios
   - Verificación de créditos
   - Procesamiento de imágenes
   - Gestión de pagos

3. **Servicios Externos**
   - **Flux Kontext API** - Modelo de IA para colorización
   - **Stripe** - Procesamiento de pagos (pendiente de integración)

## 🔐 **Sistema de Autenticación**

### **Flujo de Registro:**
1. Usuario ingresa email (y nombre opcional)
2. Se crea cuenta con **1 crédito gratuito**
3. Se almacena en localStorage (demo) o base de datos (producción)

### **Flujo de Login:**
1. Usuario ingresa email
2. Se verifica existencia de cuenta
3. Se restaura sesión con créditos disponibles

## 💳 **Sistema de Créditos**

### **Estructura de Créditos:**
- **1 crédito = 1 imagen colorizada**
- **Créditos gratuitos:** 1 por usuario nuevo
- **Créditos de pago:** Según plan seleccionado

### **Planes Disponibles:**

#### **Starter Plan - $5/mes**
- 1000 créditos mensuales
- Renovación automática
- Ideal para uso regular

#### **Professional Plan - $10 (pago único)**
- 3000 créditos permanentes
- Sin renovación
- Mejor valor por crédito

## 🛒 **Sistema de Pagos (Estructura Preparada)**

### **APIs Implementadas:**

#### **1. Crear Intención de Pago**
```typescript
POST /api/payment/create-intent
{
  "userId": "user_123",
  "planId": "professional"
}
```

#### **2. Webhook de Stripe**
```typescript
POST /api/payment/webhook
// Maneja eventos de pago exitoso
// Añade créditos automáticamente
```

### **Flujo de Pago:**
1. Usuario selecciona plan
2. Se crea PaymentIntent en Stripe
3. Usuario completa pago
4. Webhook recibe confirmación
5. Se añaden créditos automáticamente

## 🔧 **Integración Pendiente con Stripe**

### **Pasos para Completar Integración:**

1. **Instalar dependencias:**
```bash
npm install stripe @stripe/stripe-js
```

2. **Configurar variables de entorno:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Implementar en frontend:**
```typescript
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
```

4. **Conectar con API existente:**
```typescript
// En PricingCard.tsx
const handlePurchase = async (planId: string) => {
  const response = await fetch('/api/payment/create-intent', {
    method: 'POST',
    body: JSON.stringify({ userId: user.id, planId })
  });
  // Redirigir a Stripe Checkout
};
```

## 📊 **Base de Datos (Estructura Preparada)**

### **Tablas Principales:**

#### **Users**
```sql
- id (UUID)
- email (VARCHAR)
- name (VARCHAR, optional)
- credits (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### **CreditTransactions**
```sql
- id (UUID)
- user_id (UUID, foreign key)
- type (ENUM: purchase, usage, refund, bonus)
- amount (INTEGER)
- balance (INTEGER)
- description (TEXT)
- created_at (TIMESTAMP)
```

#### **Subscriptions**
```sql
- id (UUID)
- user_id (UUID, foreign key)
- plan_id (VARCHAR)
- status (ENUM: active, cancelled, expired)
- current_period_start (TIMESTAMP)
- current_period_end (TIMESTAMP)
```

## 🚀 **Implementación Actual vs. Pendiente**

### **✅ Implementado:**
- Sistema de autenticación básico
- Verificación de créditos
- APIs de pagos (estructura)
- Interfaz de usuario completa
- Integración con Flux Kontext API
- Manejo de errores y validaciones

### **⏳ Pendiente de Integración:**
- Base de datos real (PostgreSQL/MongoDB)
- Stripe Checkout completo
- Webhooks de Stripe
- Sistema de renovación automática
- Analytics y métricas de uso

## 🧪 **Testing del Sistema**

### **Flujo de Prueba:**
1. **Registro:** Crear cuenta nueva → Verificar 1 crédito
2. **Colorización:** Subir imagen → Verificar deducción de crédito
3. **Sin Créditos:** Intentar procesar → Verificar bloqueo
4. **Compra:** Seleccionar plan → Verificar flujo de pago
5. **Créditos Añadidos:** Completar pago → Verificar créditos nuevos

## 🔒 **Seguridad y Validaciones**

### **Validaciones Implementadas:**
- Verificación de créditos antes de procesar
- Validación de archivos de imagen
- Límites de tamaño y formato
- Autenticación de usuario en cada request

### **Seguridad Pendiente:**
- JWT tokens para autenticación
- Rate limiting en APIs
- Validación de webhooks de Stripe
- Encriptación de datos sensibles

## 📈 **Escalabilidad y Mejoras Futuras**

### **Optimizaciones Planificadas:**
- Cache de resultados de colorización
- Cola de procesamiento para imágenes
- CDN para almacenamiento de imágenes
- Sistema de referidos y bonificaciones
- Planes empresariales con API access

### **Métricas a Implementar:**
- Tiempo promedio de procesamiento
- Tasa de éxito de colorización
- Uso de créditos por usuario
- Conversión de trial a pago

## 🎯 **Próximos Pasos para Integración Completa**

1. **Configurar base de datos real**
2. **Integrar Stripe completamente**
3. **Implementar sistema de renovación**
4. **Añadir analytics y métricas**
5. **Testing en producción**
6. **Deploy y monitoreo**

---

**Nota:** Este sistema está diseñado para ser escalable y fácil de mantener. La estructura actual permite una integración rápida con servicios de pago reales una vez que estén configurados.
