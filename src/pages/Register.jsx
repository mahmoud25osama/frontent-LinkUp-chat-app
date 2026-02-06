import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Mail, Lock, User, AlertCircle } from 'lucide-react'
import { authAPI } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

const registerSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل')
        .max(20, 'اسم المستخدم يجب أن يكون أقل من 20 حرف')
        .required('اسم المستخدم مطلوب'),
    email: Yup.string()
        .email('بريد إلكتروني غير صالح')
        .required('البريد الإلكتروني مطلوب'),
    password: Yup.string()
        .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
        .required('كلمة المرور مطلوبة'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'كلمات المرور غير متطابقة')
        .required('تأكيد كلمة المرور مطلوب'),
})

const Register = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [error, setError] = useState('')

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            setError('')
            const response = await authAPI.register({
                username: values.username,
                email: values.email,
                password: values.password,
            })

            login(response.data.user, response.data.token)
            navigate('/chat')
        } catch (err) {
            setError(err.response?.data?.message || 'فشل إنشاء الحساب')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Logo size="lg" showText={false} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        إنشاء حساب جديد
                    </h2>
                    <p className="text-gray-600 mt-2">انضم إلى مجتمع الدردشة</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password: '',
                        confirmPassword: '',
                    }}
                    validationSchema={registerSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    اسم المستخدم
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Field
                                        name="username"
                                        type="text"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        placeholder="احمد"
                                        dir="auto"
                                    />
                                </div>
                                <ErrorMessage
                                    name="username"
                                    component="p"
                                    className="mt-1 text-sm text-red-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    البريد الإلكتروني
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Field
                                        name="email"
                                        type="email"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        placeholder="example@email.com"
                                        dir="ltr"
                                    />
                                </div>
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="mt-1 text-sm text-red-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Field
                                        name="password"
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="mt-1 text-sm text-red-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    تأكيد كلمة المرور
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Field
                                        name="confirmPassword"
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="p"
                                    className="mt-1 text-sm text-red-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting
                                    ? 'جاري إنشاء الحساب...'
                                    : 'إنشاء حساب'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <p className="text-center mt-6 text-gray-600">
                    لديك حساب بالفعل؟{' '}
                    <Link
                        to="/login"
                        className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                        تسجيل دخول
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
