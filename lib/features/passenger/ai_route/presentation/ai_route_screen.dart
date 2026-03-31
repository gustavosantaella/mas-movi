import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/colors.dart';
import '../../../../core/network/api_client.dart';
import '../../../../shared/widgets/screen_layout.dart';
import '../../../../services/location/location_helper.dart';

enum AiRouteMode { selection, analysis, chat }

class ChatMessage {
  final String text;
  final bool isUser;
  ChatMessage({required this.text, required this.isUser});
}

class AiRouteScreen extends StatefulWidget {
  const AiRouteScreen({super.key});

  @override
  State<AiRouteScreen> createState() => _AiRouteScreenState();
}

class _AiRouteScreenState extends State<AiRouteScreen> {
  AiRouteMode _mode = AiRouteMode.selection;
  String? _analysis;
  bool _loading = false;
  String? _error;

  // Chat state
  final TextEditingController _chatController = TextEditingController();
  final List<ChatMessage> _messages = [];
  bool _chatLoading = false;

  @override
  void dispose() {
    _chatController.dispose();
    super.dispose();
  }

  Future<void> _fetchAnalysis() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final api = ApiClient();
      
      // Verification: Check if token exists in ApiClient
      // Note: We can't access private _token directly but we can try to debug via logs
      debugPrint('AI Route: Fetching analysis from /mobility/trips/ai-analysis');
      
      final response = await api.dio.get('/mobility/trips/ai-analysis');
      final data = ApiClient.parseResponse(response);
      final analysis = data['data']?['analysis'] as String? ?? '';
      
      if (mounted) {
        setState(() {
          _analysis = analysis;
          _loading = false;
        });
      }
    } catch (e) {
      String errorMessage = e.toString();
      if (errorMessage.contains('401')) {
        errorMessage = 'Tu sesión ha expirado o no tienes permisos. Por favor, reinicia la app o vuelve a iniciar sesión.';
      } else if (errorMessage.contains('500')) {
        errorMessage = 'El servidor de IA tuvo un problema. Por favor intenta de nuevo en unos momentos.';
      }
      
      if (mounted) {
        setState(() {
          _error = errorMessage;
          _loading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgWhite,
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              AppColors.bgWhite,
              const Color(0xFFF5F3FF).withValues(alpha: 0.5),
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                child: ScreenHeader(
                  title: _mode == AiRouteMode.chat ? 'Asistente de Ruta' : 'Análisis con IA',
                  onBack: _mode != AiRouteMode.selection ? () {
                    setState(() {
                      _mode = AiRouteMode.selection;
                      _error = null;
                      _loading = false;
                      _chatLoading = false;
                    });
                  } : null,
                ),
              ),

              // ─── Content ─────────────────────────────
              Expanded(
                child: AnimatedSwitcher(
                  duration: 400.ms,
                  child: _buildCurrentMode(),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentMode() {
    switch (_mode) {
      case AiRouteMode.selection:
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Column(
            children: [
              _buildHero(),
              const SizedBox(height: 24),
              _buildSelection(),
            ],
          ),
        );
      case AiRouteMode.analysis:
        if (_loading) return _buildShimmer();
        if (_error != null) return _buildError();
        return SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: _buildAnalysis(),
        );
      case AiRouteMode.chat:
        return _buildChat();
    }
  }

  Widget _buildSelection() {
    return Column(
      children: [
        _SelectionCard(
          title: 'Obtener resumen',
          description: 'Analiza tu historial de viajes y obtén consejos personalizados.',
          icon: Icons.history,
          color: const Color(0xFF7C5CFC),
          onTap: () {
            setState(() => _mode = AiRouteMode.analysis);
            _fetchAnalysis();
          },
        ),
        const SizedBox(height: 16),
        _SelectionCard(
          title: '¿A dónde quieres ir?',
          description: 'Dime tu destino y te ayudaré a planificar la mejor ruta.',
          icon: Icons.map,
          color: AppColors.salmon,
          onTap: () {
            setState(() {
              _mode = AiRouteMode.chat;
              if (_messages.isEmpty) {
                _messages.add(ChatMessage(
                  text: '¡Hola! 🚌 Soy tu asistente de Guayaba. ¿Dime a dónde quieres ir hoy?',
                  isUser: false,
                ));
              }
            });
          },
        ),
      ],
    ).animate().fadeIn(duration: 400.ms);
  }

  Widget _buildChat() {
    return Column(
      children: [
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(vertical: 10),
            itemCount: _messages.length + (_chatLoading ? 1 : 0),
            itemBuilder: (context, index) {
              if (index == _messages.length) {
                return _buildChatTyping();
              }
              final msg = _messages[index];
              return _ChatBubble(message: msg);
            },
          ),
        ),
        _buildChatInput(),
      ],
    );
  }

  Widget _buildChatTyping() {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: AppColors.bgLightGray,
              borderRadius: BorderRadius.circular(16),
            ),
            child: const SizedBox(
              width: 20, height: 20,
              child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF7C5CFC)),
            ),
          ),
        ],
      ),
    ).animate().fadeIn();
  }

  Widget _buildChatInput() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: const BoxDecoration(
        color: Colors.transparent,
      ),
      child: Row(
        children: [
          Expanded(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(30),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: TextField(
                controller: _chatController,
                decoration: const InputDecoration(
                  hintText: 'Escribe tu destino...',
                  border: InputBorder.none,
                ),
                onSubmitted: (_) => _sendChatMessage(),
              ),
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: _sendChatMessage,
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: Color(0xFF7C5CFC),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.send, color: Colors.white, size: 22),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _sendChatMessage() async {
    final text = _chatController.text.trim();
    if (text.isEmpty || _chatLoading) return;

    setState(() {
      _messages.add(ChatMessage(text: text, isUser: true));
      _chatController.clear();
      _chatLoading = true;
    });

    try {
      // Get location
      final pos = await LocationHelper.getCurrentPosition();
      final lat = pos?.latitude ?? 10.4806; // Fallback Caracas
      final lng = pos?.longitude ?? -66.9036;

      final api = ApiClient();
      final response = await api.dio.post('/mobility/trips/ai-chat', data: {
        'query': text,
        'lat': lat,
        'lng': lng,
      });

      final data = ApiClient.parseResponse(response);
      final aiMsg = data['data']?['response'] as String? ?? 'No pude procesar tu solicitud.';

      if (mounted) {
        setState(() {
          _messages.add(ChatMessage(text: aiMsg, isUser: false));
          _chatLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _messages.add(ChatMessage(
            text: 'Lo siento, tuve un problema al conectarme con el servidor.',
            isUser: false,
          ));
          _chatLoading = false;
        });
      }
    }
  }

  // ─── Hero Card ───────────────────────────────────────
  Widget _buildHero() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF7C5CFC), Color(0xFF6C47F5)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7C5CFC).withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 52, height: 52,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Icon(Icons.auto_awesome, size: 28, color: Colors.white),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Tu asistente de rutas',
                  style: TextStyle(
                    fontSize: 18, fontWeight: FontWeight.w800, color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Análisis inteligente de tus viajes',
                  style: TextStyle(
                    fontSize: 13, color: Colors.white.withValues(alpha: 0.8),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.1, end: 0);
  }

  // ─── Shimmer Loading ─────────────────────────────────
  Widget _buildShimmer() {
    return Column(
      children: [
        const Center(
          child: Padding(
            padding: EdgeInsets.symmetric(vertical: 20),
            child: CircularProgressIndicator(color: AppColors.salmon),
          ),
        ),
        const Text(
          'Analizando tus rutas...',
          style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.grayNeutral),
        ),
        const SizedBox(height: 20),
        ...List.generate(3, (i) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: Container(
              width: double.infinity,
              height: i == 0 ? 80 : 60,
              decoration: BoxDecoration(
                color: AppColors.bgLightGray,
                borderRadius: BorderRadius.circular(16),
              ),
            )
                .animate(onPlay: (c) => c.repeat(reverse: true))
                .shimmer(
                  duration: 1200.ms,
                  color: Colors.white.withValues(alpha: 0.5),
                ),
          );
        }),
      ],
    );
  }

  // ─── Error State ─────────────────────────────────────
  Widget _buildError() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF2F2),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFFECACA)),
      ),
      child: Column(
        children: [
          const Icon(Icons.error_outline, size: 40, color: Color(0xFFEF4444)),
          const SizedBox(height: 12),
          const Text(
            'No pudimos generar el análisis',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.charcoal),
          ),
          const SizedBox(height: 6),
          Text(
            _error ?? 'Error desconocido',
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 13, color: AppColors.grayNeutral),
          ),
          const SizedBox(height: 16),
          GestureDetector(
            onTap: _fetchAnalysis,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFF7C5CFC),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text('Reintentar',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
            ),
          ),
        ],
      ),
    ).animate().fadeIn(duration: 300.ms);
  }

  // ─── Analysis Result ─────────────────────────────────
  Widget _buildAnalysis() {
    final sections = _parseSections(_analysis!);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Analysis cards
        ...sections.asMap().entries.map((entry) {
          final i = entry.key;
          final section = entry.value;
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: _AnalysisCard(
              title: section['title']!,
              body: section['body']!,
              index: i,
            ),
          )
              .animate()
              .fadeIn(delay: (100 * i).ms, duration: 400.ms)
              .slideX(begin: 0.05, end: 0);
        }),

        const SizedBox(height: 8),

        // Refresh button
        Center(
          child: GestureDetector(
            onTap: _fetchAnalysis,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0EAFF),
                borderRadius: BorderRadius.circular(14),
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.refresh, size: 18, color: Color(0xFF7C5CFC)),
                  SizedBox(width: 8),
                  Text('Generar nuevo análisis',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF7C5CFC))),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: 30),
      ],
    );
  }

  /// Parse the AI response into sections by splitting on lines that start with an emoji.
  List<Map<String, String>> _parseSections(String text) {
    final lines = text.split('\n');
    final sections = <Map<String, String>>[];
    String currentTitle = '';
    StringBuffer currentBody = StringBuffer();

    for (final line in lines) {
      final trimmed = line.trim();
      if (trimmed.isEmpty) {
        currentBody.writeln();
        continue;
      }

      // Detect section headers: lines that start with emoji(s) followed by text
      final hasEmojiStart = trimmed.isNotEmpty && _startsWithEmoji(trimmed);
      final isShortEnough = trimmed.length < 80;

      if (hasEmojiStart && isShortEnough && currentBody.toString().trim().isNotEmpty) {
        // Save previous section
        if (currentTitle.isNotEmpty || currentBody.toString().trim().isNotEmpty) {
          sections.add({
            'title': currentTitle,
            'body': currentBody.toString().trim(),
          });
        }
        currentTitle = trimmed;
        currentBody = StringBuffer();
      } else if (hasEmojiStart && isShortEnough && currentBody.toString().trim().isEmpty) {
        // First section title
        currentTitle = trimmed;
      } else {
        currentBody.writeln(trimmed);
      }
    }

    // Add last section
    if (currentTitle.isNotEmpty || currentBody.toString().trim().isNotEmpty) {
      sections.add({
        'title': currentTitle,
        'body': currentBody.toString().trim(),
      });
    }

    // If parsing failed (no sections found), return the whole text as one section
    if (sections.isEmpty) {
      sections.add({'title': '🤖 Análisis', 'body': text.trim()});
    }

    return sections;
  }

  bool _startsWithEmoji(String text) {
    if (text.isEmpty) return false;
    final code = text.codeUnitAt(0);
    // Common emoji ranges: emoticons, symbols, dingbats, etc.
    return code > 127;
  }
}

// ─── Selection Card ───────────────────────────────────
class _SelectionCard extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _SelectionCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: color.withValues(alpha: 0.1),
              blurRadius: 15,
              offset: const Offset(0, 8),
            ),
          ],
          border: Border.all(color: color.withValues(alpha: 0.1), width: 1),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 28),
            ),
            const SizedBox(width: 18),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: TextStyle(
                      fontSize: 17, fontWeight: FontWeight.w800, color: color,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 13, color: AppColors.grayNeutral, height: 1.3,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.chevron_right, color: color.withValues(alpha: 0.3)),
          ],
        ),
      ),
    );
  }
}

// ─── Chat Bubble ──────────────────────────────────────
class _ChatBubble extends StatelessWidget {
  final ChatMessage message;

  const _ChatBubble({required this.message});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: message.isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          if (!message.isUser) ...[
            Container(
              width: 32, height: 32,
              decoration: const BoxDecoration(
                color: Color(0xFF7C5CFC),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.auto_awesome, size: 16, color: Colors.white),
            ),
            const SizedBox(width: 8),
          ],
          Flexible(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                color: message.isUser ? const Color(0xFF7C5CFC) : Colors.white,
                borderRadius: BorderRadius.circular(18).copyWith(
                  bottomRight: message.isUser ? const Radius.circular(0) : null,
                  bottomLeft: !message.isUser ? const Radius.circular(0) : null,
                ),
                boxShadow: [
                  if (!message.isUser)
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.05),
                      blurRadius: 5,
                      offset: const Offset(0, 2),
                    ),
                ],
              ),
              child: Text(
                message.text,
                style: TextStyle(
                  fontSize: 14,
                  height: 1.4,
                  color: message.isUser ? Colors.white : AppColors.charcoal,
                ),
              ),
            ),
          ),
          if (message.isUser) const SizedBox(width: 40),
        ],
      ),
    );
  }
}

// ─── Analysis Card Widget ────────────────────────────
class _AnalysisCard extends StatelessWidget {
  final String title;
  final String body;
  final int index;

  const _AnalysisCard({
    required this.title,
    required this.body,
    required this.index,
  });

  static const _cardColors = [
    Color(0xFFF0EAFF), // purple tint
    Color(0xFFE0F7F0), // green tint
    Color(0xFFFFF3E0), // orange tint
    Color(0xFFE3F2FD), // blue tint
    Color(0xFFFCE4EC), // pink tint
  ];

  static const _iconColors = [
    Color(0xFF7C5CFC),
    Color(0xFF10B981),
    Color(0xFFFF9800),
    Color(0xFF2196F3),
    Color(0xFFE91E63),
  ];

  @override
  Widget build(BuildContext context) {
    final bgColor = _cardColors[index % _cardColors.length];
    final accentColor = _iconColors[index % _iconColors.length];

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: accentColor.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (title.isNotEmpty) ...[
            Text(
              title,
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: accentColor,
              ),
            ),
            const SizedBox(height: 8),
          ],
          Text(
            body,
            style: const TextStyle(
              fontSize: 14,
              height: 1.5,
              color: AppColors.charcoal,
            ),
          ),
        ],
      ),
    );
  }
}
