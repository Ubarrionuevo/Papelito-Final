# 🎨 Sketcha - Modo Simulación

## 📋 **¿Qué es el Modo Simulación?**

Este es un sistema **completamente simulado** para hacer pruebas finales antes de integrar pagos reales. No hay base de datos real, no hay Stripe real, solo simulación en memoria.

## 🚀 **Funcionalidades Disponibles:**

### **✅ Sistema de Usuarios (Simulado)**
- Registro con email
- Login con email existente
- 1 crédito gratuito por usuario nuevo
- Almacenamiento en memoria (se pierde al reiniciar)

### **✅ Sistema de Créditos (Simulado)**
- Verificación de créditos antes de procesar
- Deducción automática de 1 crédito por imagen
- Bloqueo cuando no hay créditos
- Simulación de compra de créditos

### **✅ Colorización de Imágenes (REAL)**
- Integración real con Flux Kontext API
- Procesamiento asíncrono con polling
- Validación de archivos
- Resultados reales de IA

## 🧪 **Cómo Probar el Sistema:**

### **1. Registro de Usuario:**
```
POST /api/auth/register
{
  "email": "test@example.com",
  "name": "Usuario Test"
}
```
**Resultado:** Usuario creado con 1 crédito

### **2. Login:**
```
POST /api/auth/login
{
  "email": "test@example.com"
}
```
**Resultado:** Sesión iniciada

### **3. Verificar Créditos:**
```
POST /api/credits/check
{
  "userId": "user_123"
}
```
**Resultado:** Estado actual de créditos

### **4. Procesar Imagen:**
```
POST /api/colorize
FormData: image + userId
```
**Resultado:** Imagen procesada, 1 crédito deducido

### **5. Simular Compra (Para Pruebas):**
```
POST /api/payment/create-intent
{
  "userId": "user_123",
  "planId": "professional"
}
```
**Resultado:** Intención de pago simulada

## 🔧 **APIs Implementadas:**

- **`/api/auth/register`** - Crear usuario
- **`/api/auth/login`** - Iniciar sesión
- **`/api/credits/check`** - Verificar créditos
- **`/api/colorize`** - Procesar imagen
- **`/api/poll`** - Verificar estado de procesamiento
- **`/api/payment/create-intent`** - Simular intención de pago
- **`/api/payment/webhook`** - Webhook simulado

## 💡 **Para Integrar Pagos Reales (Más Adelante):**

1. **Reemplazar AuthService** con base de datos real
2. **Integrar Stripe** en las APIs de pagos
3. **Implementar webhooks reales** de Stripe
4. **Añadir persistencia** de datos

## 🎯 **Estado Actual:**

- ✅ **Frontend completo** con autenticación
- ✅ **Sistema de créditos** funcional
- ✅ **APIs de colorización** reales
- ✅ **Simulación de pagos** para pruebas
- ⏳ **Base de datos real** (pendiente)
- ⏳ **Stripe real** (pendiente)

## 🚨 **Limitaciones del Modo Simulación:**

- Los usuarios se pierden al reiniciar el servidor
- No hay persistencia de datos
- Los pagos son simulados
- Los créditos se resetean

## 📝 **Nota Importante:**

**Este sistema está diseñado para PRUEBAS FINALES.** Una vez que estés satisfecho con la funcionalidad, solo necesitas:

1. Conectar una base de datos real
2. Integrar Stripe
3. ¡Listo para producción!

---

**¡El sistema está listo para pruebas!** 🎉
