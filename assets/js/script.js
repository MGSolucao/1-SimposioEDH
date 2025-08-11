// Smooth scrolling para links de navegação
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Form submission
    const form = document.getElementById('inscricaoForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            const googleFormsUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdyOfEJdVCa8QqbYYFnfhBarccBhAcAmvxc2lr5NffLzq-pbg/formResponse';

            const payload = new FormData();
            payload.append('entry.687126127', data.nome); // Nome
            payload.append('entry.1380808385', data.email); // Email
            payload.append('entry.2050002593', data.telefone); // Telefone
            payload.append('entry.2071460119', data.ocupacao); // Ocupação atual
            payload.append('entry.839337160', data.comentarios); // Comentários

            fetch(googleFormsUrl, {
                method: 'POST',
                mode: 'no-cors',
                body: payload
            })
            .then(() => {
                showSuccessMessage();
                form.reset();
            })
            .catch(error => {
                console.error('Erro ao enviar o formulário:', error);
                alert('Ocorreu um erro ao enviar sua inscrição. Por favor, tente novamente.');
            });
        });
    }
    
    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.topic-card, .speaker-card, .info-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Header background on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
});

// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
    // Cria elemento de notificação
    const notification = document.createElement('div');
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #9B59B6, #5DADE2);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        ">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 10px;">
                <i class="fas fa-check-circle"></i>
                <span>Inscrição enviada com sucesso!</span>
            </div>
            <a href="https://mpago.li/2bb4KaA" target="_blank" style="
                display: block;
                text-align: center;
                background-color: #fff;
                color: #9B59B6;
                padding: 0.5rem 1rem;
                border-radius: 5px;
                text-decoration: none;
                font-weight: bold;
                margin-top: 10px;
            ">Acessar Pagamento</a>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove a notificação após 3 segundos
    // setTimeout(() => {
    //     notification.style.animation = 'slideOutRight 0.3s ease';
    //     setTimeout(() => {
    //         document.body.removeChild(notification);
    //     }, 300);
    // }, 3000);
}

// Adiciona estilos para as animações de notificação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border-radius: 0 0 8px 8px;
        }
        
        .nav-links.active a {
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .nav-links.active a:last-child {
            border-bottom: none;
        }
    }
`;
document.head.appendChild(style);

// Função para validação de formulário
function validateForm(formData) {
    const requiredFields = ['nome', 'email', 'telefone', 'profissao', 'interesse'];
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].trim() === '') {
            errors.push(`O campo ${field} é obrigatório`);
        }
    });
    
    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
        errors.push('Por favor, insira um email válido');
    }
    
    return errors;
}

// Função para formatar telefone
function formatPhone(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    }
    
    input.value = value;
}

// Aplica formatação de telefone
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            formatPhone(this);
        });
    }
});

