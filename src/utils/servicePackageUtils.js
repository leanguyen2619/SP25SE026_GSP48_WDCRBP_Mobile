export const getServicePackageInfo = (packageName) => {
    const type = packageName?.toLowerCase().trim().replace(/\s+/g, '') || '';
    
    if (type.includes('gold') || type === 'gói vàng' || type === 'goivang') {
        return {
            label: 'Gói Vàng',
            badgeStyle: {
                backgroundColor: '#FFF8DC',
                borderColor: '#FFD700',
            },
            textStyle: {
                color: '#DAA520',
            }
        };
    }
    
    if (type.includes('silver') || type === 'gói bạc' || type === 'goibac') {
        return {
            label: 'Gói Bạc',
            badgeStyle: {
                backgroundColor: '#F8F9FA',
                borderColor: '#C0C0C0',
            },
            textStyle: {
                color: '#808080',
            }
        };
    }
    
    // Mặc định là Gói Đồng
    return {
        label: 'Gói Đồng',
        badgeStyle: {
            backgroundColor: '#FFF5EE',
            borderColor: '#CD7F32',
        },
        textStyle: {
            color: '#CD7F32',
        }
    };
}; 