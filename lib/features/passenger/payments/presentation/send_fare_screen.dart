import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../../shared/widgets/app_button.dart';

class SendFareScreen extends StatefulWidget {
  const SendFareScreen({super.key});

  @override
  State<SendFareScreen> createState() => _SendFareScreenState();
}

class _SendFareScreenState extends State<SendFareScreen> {
  int _step = 1; // 1: Search, 2: Amount, 3: Success
  final TextEditingController _identifierController = TextEditingController();
  String _amount = '0';
  bool _loading = false;
  bool _affiliate = false;
  String? _error;
  
  // Tabs & Affiliates
  int _tabIndex = 0; // 0: Sin afiliar, 1: Afiliado
  String _searchBy = 'email'; // 'email' or 'phone'
  List<dynamic> _affiliates = [];
  bool _loadingAffiliates = false;
  
  // Recipient data
  String? _recipientName;
  String? _recipientIdentifier;

  @override
  void initState() {
    super.initState();
    _fetchAffiliates();
  }

  @override
  void dispose() {
    _identifierController.dispose();
    super.dispose();
  }

  // ─── Logic ──────────────────────────────────────────
  
  Future<void> _fetchAffiliates() async {
    setState(() { _loadingAffiliates = true; });
    try {
      final api = ApiClient();
      final response = await api.dio.get('/mobility/transactions/affiliates');
      final data = ApiClient.parseResponse(response);
      if (mounted) {
        setState(() {
          _affiliates = data['data'] ?? [];
          _loadingAffiliates = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() { _loadingAffiliates = false; });
    }
  }

  Future<void> _verifyRecipient() async {
    final identifier = _identifierController.text.trim();
    if (identifier.isEmpty) return;

    setState(() { _loading = true; _error = null; });

    try {
      final api = ApiClient();
      final response = await api.dio.post('/mobility/transactions/verify-recipient', data: {
        'identifier': identifier,
        'searchBy': _searchBy,
      });
      
      final data = ApiClient.parseResponse(response);
      if (mounted) {
        setState(() {
          _recipientName = data['data']?['name'];
          _recipientIdentifier = identifier;
          _step = 2;
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Usuario no encontrado o error de conexión.';
          _loading = false;
        });
      }
    }
  }

  void _handleConfirmPress() {
    final amt = double.tryParse(_amount) ?? 0;
    if (amt <= 0) return;

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Confirmar Envío', style: TextStyle(fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('¿Estás seguro de enviar esta cantidad?'),
            const SizedBox(height: 16),
            Text('A: $_recipientName', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.salmon)),
            Text('Monto: Bs. $_amount', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancelar', style: TextStyle(color: AppColors.grayNeutral)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              _confirmTransfer();
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.salmon,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Confirmar', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmTransfer() async {
    final amt = double.tryParse(_amount) ?? 0;
    if (amt <= 0) return;

    setState(() { _loading = true; _error = null; });

    try {
      final api = ApiClient();
      await api.dio.post('/mobility/transactions/transfer', data: {
        'identifier': _recipientIdentifier,
        'amount': amt,
        'searchBy': _searchBy,
      });

      if (mounted) {
        setState(() {
          _step = 3;
          _loading = false;
        });

        // ─── Affiliate if requested ───
        if (_affiliate) {
          api.dio.post('/mobility/transactions/affiliate', data: {
            'identifier': _recipientIdentifier,
            'searchBy': _searchBy,
          }).then((_) => null).catchError((e) {
            debugPrint('Error affiliating: $e');
            return null;
          });
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Saldo insuficiente o error al procesar el envío.';
          _loading = false;
        });
      }
    }
  }

  void _onKeyTap(String key) {
    setState(() {
      if (key == 'delete') {
        if (_amount.length > 1) {
          _amount = _amount.substring(0, _amount.length - 1);
        } else {
          _amount = '0';
        }
      } else if (key == '.') {
        if (!_amount.contains('.')) {
          _amount += '.';
        }
      } else {
        if (_amount == '0') {
          _amount = key;
        } else {
          _amount += key;
        }
      }
    });
  }

  // ─── Build ──────────────────────────────────────────

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: ScreenHeader(
                title: 'Enviar Pasaje',
                onBack: () {
                  if (_step == 2) {
                    setState(() => _step = 1);
                  } else if (_step == 3) {
                    Navigator.pop(context);
                  } else {
                    Navigator.pop(context);
                  }
                },
              ),
            ),
            
            Expanded(
              child: AnimatedSwitcher(
                duration: 300.ms,
                child: _buildStep(),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStep() {
    switch (_step) {
      case 1: return _buildSearchStep();
      case 2: return _buildAmountStep();
      case 3: return _buildSuccessStep();
      default: return const SizedBox();
    }
  }

  Widget _buildSearchStep() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '¿A quién deseas enviarle?',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.charcoal),
              ),
              const SizedBox(height: 4),
              const Text(
                'Selecciona un contacto o ingresa sus datos manualmente.',
                style: TextStyle(fontSize: 14, color: AppColors.grayNeutral),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 16),

        // Custom Tab Bar
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 24),
          decoration: BoxDecoration(
            color: AppColors.bgLightGray,
            borderRadius: BorderRadius.circular(16),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Row(
              children: [
                _buildTabItem(index: 0, label: 'Sin afiliar'),
                _buildTabItem(index: 1, label: 'Afiliado'),
              ],
            ),
          ),
        ),
        
        const SizedBox(height: 8),
        
        Expanded(
          child: _tabIndex == 0 ? _buildManualEntry() : _buildAffiliatesList(),
        ),
      ],
    ).animate().fadeIn();
  }

  Widget _buildTabItem({required int index, required String label}) {
    final bool active = _tabIndex == index;
    return Expanded(
      child: Material(
        color: active ? Colors.white : Colors.transparent,
        child: InkWell(
          onTap: () {
            if (_tabIndex != index) {
              setState(() {
                _tabIndex = index;
                _error = null;
              });
            }
          },
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 12),
            decoration: BoxDecoration(
              boxShadow: active ? [
                BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4, offset: const Offset(0, 2))
              ] : null,
            ),
            alignment: Alignment.center,
            child: Text(
              label,
              style: TextStyle(
                fontWeight: active ? FontWeight.w900 : FontWeight.w600,
                color: active ? AppColors.salmon : AppColors.grayNeutral,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildManualEntry() {
    return SingleChildScrollView(
      key: const ValueKey('manual'),
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Buscar por:', style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppColors.charcoal)),
          Row(
            children: [
              Expanded(
                child: RadioListTile<String>(
                  title: const Text('Correo', style: TextStyle(fontSize: 12)),
                  value: 'email',
                  groupValue: _searchBy,
                  activeColor: AppColors.salmon,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) => setState(() {
                    _searchBy = val!;
                    _identifierController.clear();
                  }),
                ),
              ),
              Expanded(
                child: RadioListTile<String>(
                  title: const Text('Teléfono', style: TextStyle(fontSize: 12)),
                  value: 'phone',
                  groupValue: _searchBy,
                  activeColor: AppColors.salmon,
                  contentPadding: EdgeInsets.zero,
                  onChanged: (val) => setState(() {
                    _searchBy = val!;
                    _identifierController.clear();
                  }),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextField(
            controller: _identifierController,
            keyboardType: _searchBy == 'email' ? TextInputType.emailAddress : TextInputType.phone,
            decoration: InputDecoration(
              hintText: _searchBy == 'email' ? 'ejemplo@correo.com' : 'Número de teléfono',
              filled: true,
              fillColor: AppColors.bgLightGray,
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(16),
                borderSide: BorderSide.none,
              ),
              prefixIcon: Icon(_searchBy == 'email' ? Icons.email_outlined : Icons.phone_android_outlined),
            ),
          ),
          const SizedBox(height: 16),
          SwitchListTile(
            title: const Text('¿Afiliar usuario?', style: TextStyle(fontSize: 14)),
            subtitle: const Text('Guardar en contactos frecuentes', style: TextStyle(fontSize: 12)),
            value: _affiliate,
            activeColor: AppColors.salmon,
            contentPadding: EdgeInsets.zero,
            onChanged: (val) => setState(() => _affiliate = val),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13)),
          ],
          const SizedBox(height: 32),
          AppButton(
            text: 'Continuar',
            isLoading: _loading,
            onPressed: _verifyRecipient,
          ),
        ],
      ),
    ).animate().fadeIn();
  }

  Widget _buildAffiliatesList() {
    if (_loadingAffiliates) {
      return const Center(child: CircularProgressIndicator(color: AppColors.salmon));
    }

    if (_affiliates.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.person_add_disabled_outlined, size: 64, color: AppColors.grayNeutral.withOpacity(0.3)),
            const SizedBox(height: 16),
            const Text('Aún no tienes afiliados', style: TextStyle(color: AppColors.grayNeutral)),
          ],
        ),
      );
    }

    return ListView.builder(
      key: const ValueKey('affiliates'),
      itemCount: _affiliates.length,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      itemBuilder: (context, index) {
        final a = _affiliates[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.borderLightGray),
          ),
          child: ListTile(
            onTap: () {
              setState(() {
                _recipientIdentifier = a['email'] ?? a['phone'];
                _recipientName = a['alias'] ?? '${a['firstName']} ${a['lastName']}';
                _searchBy = a['email'] != null ? 'email' : 'phone';
                _step = 2;
                _amount = '0';
              });
            },
            leading: CircleAvatar(
              backgroundColor: AppColors.salmon.withOpacity(0.1),
              child: const Icon(Icons.person, color: AppColors.salmon),
            ),
            title: Text(a['alias'] ?? '${a['firstName']} ${a['lastName']}', 
                style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.charcoal)),
            subtitle: Text(a['email'] ?? '', style: const TextStyle(fontSize: 12)),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14, color: AppColors.grayNeutral),
          ),
        ).animate().fadeIn(delay: (index * 40).ms).slideX(begin: 0.1);
      },
    );
  }

  Widget _buildAmountStep() {
    return Column(
      children: [
        // Recipient header
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 24),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.salmon.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              const CircleAvatar(
                backgroundColor: AppColors.salmon,
                child: Icon(Icons.person, color: Colors.white),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(_recipientName ?? '', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.salmon)),
                    Text(_recipientIdentifier ?? '', style: const TextStyle(fontSize: 12, color: AppColors.grayNeutral)),
                  ],
                ),
              ),
              TextButton(
                onPressed: () => setState(() => _step = 1),
                child: const Text('Cambiar', style: TextStyle(fontSize: 12)),
              ),
            ],
          ),
        ),
        
        const Spacer(),
        
        // Amount Display
        Text(
          'Bs. $_amount',
          style: const TextStyle(fontSize: 48, fontWeight: FontWeight.w900, color: AppColors.charcoal),
        ),
        const Text('Ingresa el monto a enviar', style: TextStyle(color: AppColors.grayNeutral)),
        
        const Spacer(),

        if (_error != null) 
          Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: Text(_error!, style: const TextStyle(color: Colors.red, fontSize: 13)),
          ),

        // Keypad
        _buildKeypad(),
        
        const SizedBox(height: 24),
        
        // Confirm Button
        Padding(
          padding: const EdgeInsets.only(left: 24, right: 24, bottom: 24),
          child: AppButton(
            text: 'Confirmar Envío',
            isLoading: _loading,
            onPressed: _handleConfirmPress,
          ),
        ),
      ],
    ).animate().fadeIn();
  }

  Widget _buildKeypad() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 40),
      child: Column(
        children: [
          _buildKeyRow(['1', '2', '3']),
          _buildKeyRow(['4', '5', '6']),
          _buildKeyRow(['7', '8', '9']),
          _buildKeyRow(['.', '0', 'delete']),
        ],
      ),
    );
  }

  Widget _buildKeyRow(List<String> keys) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: keys.map((k) {
        return GestureDetector(
          onTap: () => _onKeyTap(k),
          child: Container(
            width: 70, height: 70,
            alignment: Alignment.center,
            color: Colors.transparent,
            child: k == 'delete' 
              ? const Icon(Icons.backspace_outlined, color: AppColors.charcoal)
              : Text(k, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w600, color: AppColors.charcoal)),
          ),
        );
      }).toList(),
    );
  }

  Widget _buildSuccessStep() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 100, height: 100,
              decoration: const BoxDecoration(
                color: AppColors.successGreen,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.check, size: 60, color: Colors.white),
            ),
            const SizedBox(height: 32),
            const Text(
              '¡Envío Exitoso!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900, color: AppColors.charcoal),
            ),
            const SizedBox(height: 12),
            Text(
              'Has enviado Bs. $_amount a $_recipientName correctamente.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.grayNeutral, fontSize: 16),
            ),
            const SizedBox(height: 48),
            AppButton(
              text: 'Volver a Pagos',
              color: AppColors.charcoal,
              onPressed: () => Navigator.pop(context),
            ),
          ],
        ),
      ),
    ).animate().scale(duration: 400.ms, curve: Curves.bounceOut);
  }
}
