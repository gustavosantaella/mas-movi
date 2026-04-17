import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/screen_layout.dart';

class AffiliatesScreen extends StatefulWidget {
  const AffiliatesScreen({super.key});

  @override
  State<AffiliatesScreen> createState() => _AffiliatesScreenState();
}

class _AffiliatesScreenState extends State<AffiliatesScreen> {
  List<dynamic> _affiliates = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    debugPrint('AffiliatesScreen initState');
    debugPrint('API URL: ${ApiClient.baseUrl}');
    super.initState();
    _fetchAffiliates();
  }

  Future<void> _fetchAffiliates() async {
    debugPrint('API URL: ${ApiClient.baseUrl}');

    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final api = ApiClient();
      final response = await api.dio.get('/affiliates');
      final data = ApiClient.parseResponse(response);
      if (mounted) {
        setState(() {
          _affiliates = data['data'] ?? [];
          _loading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _error = 'Error al cargar los contactos afiliados.';
          _loading = false;
        });
      }
    }
  }

  Future<void> _deleteAffiliate(int id) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder:
          (context) => AlertDialog(
            title: const Text('Eliminar Afiliado'),
            content: const Text(
              '¿Estás seguro de que deseas eliminar este contacto?',
            ),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancelar'),
              ),
              TextButton(
                onPressed: () => Navigator.pop(context, true),
                style: TextButton.styleFrom(foregroundColor: Colors.red),
                child: const Text('Eliminar'),
              ),
            ],
          ),
    );

    if (confirm != true) return;

    setState(() => _loading = true);
    try {
      final api = ApiClient();
      await api.dio.delete('/affiliates/$id');
      _fetchAffiliates();
    } catch (e) {
      setState(() => _loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error al eliminar el afiliado')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
              child: ScreenHeader(
                title: 'Mis Afiliados',
                onBack: () => Navigator.pop(context),
              ),
            ),

            Expanded(child: _buildBody()),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/send-fare'),
        backgroundColor: AppColors.salmon,
        child: const Icon(Icons.person_add, color: Colors.white),
      ),
    );
  }

  Widget _buildBody() {
    if (_loading) {
      return const Center(
        child: CircularProgressIndicator(color: AppColors.salmon),
      );
    }

    if (_error != null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 48, color: Colors.red),
            const SizedBox(height: 16),
            Text(_error!, style: const TextStyle(color: AppColors.grayNeutral)),
            TextButton(
              onPressed: _fetchAffiliates,
              child: const Text(
                'Reintentar',
                style: TextStyle(color: AppColors.salmon),
              ),
            ),
          ],
        ),
      );
    }

    if (_affiliates.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.people_outline,
              size: 80,
              color: AppColors.grayNeutral.withOpacity(0.2),
            ),
            const SizedBox(height: 20),
            const Text(
              'No tienes contactos afiliados',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppColors.charcoal,
              ),
            ),
            const SizedBox(height: 8),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 40),
              child: Text(
                'Agrega a tus amigos y familiares para enviarles pasaje más rápido.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.grayNeutral, fontSize: 13),
              ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
      itemCount: _affiliates.length,
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
              // Action: Send money or show details
            },
            leading: CircleAvatar(
              backgroundColor: AppColors.salmon.withOpacity(0.1),
              child: const Icon(Icons.person, color: AppColors.salmon),
            ),
            title: Text(
              a['alias'] ?? '${a['firstName']} ${a['lastName']}',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.charcoal,
              ),
            ),
            subtitle: Text(
              a['email'] ?? a['phone'] ?? '',
              style: const TextStyle(
                fontSize: 12,
                color: AppColors.grayNeutral,
              ),
            ),
            trailing: IconButton(
              icon: const Icon(
                Icons.delete_outline,
                size: 20,
                color: AppColors.grayNeutral,
              ),
              onPressed: () => _deleteAffiliate(a['id']),
            ),
          ),
        ).animate().fadeIn(delay: (index * 40).ms).slideX(begin: 0.05);
      },
    );
  }
}
